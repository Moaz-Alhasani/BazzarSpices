import express,{Request,Response,NextFunction, request} from "express"
import { prisma } from "../prisma";
import bcrypt from "bcrypt"
import { generateJwt } from "../globals/middlware/auth.middlware";
import { SendEmail } from "../globals/constants/SendEmail";
class AdminServices {
    public async register(requestBody: any) {
      const { name, email, password } = requestBody;
      const emailExists = await this.IsEmailAlreadyExist(email);
      if (emailExists) {
        throw new Error("Email is already registered.");
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newAdmin = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role:"ADMIN"
        },
      });

      const payload = {
            email:newAdmin.email,
            name: newAdmin.name,
            role: newAdmin.role,
            id: newAdmin.id
        };
        const token=await generateJwt(payload)
      return token;
    }
    public async AddCategory(requestBody:any){
      console.log(requestBody)
      const{ name }=requestBody
      const newCategory=await prisma.category.create({
        data:{
          name
        }
      })
      return newCategory
    }
    public async updateCategory(requestBody: any, categoryId: number) {
      const { name } = requestBody;
      console.log(categoryId)
      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: { name },
      });
      return updatedCategory;
    }

    public async removeCategory(categoryId: number) {
      const relatedProducts = await prisma.product.findMany({
        where: { categoryId },
      });

      if (relatedProducts.length > 0) {
        throw new Error('Cannot delete category with associated products');
      }

      const deletedCategory = await prisma.category.delete({
        where: { id: categoryId },
      });

      return deletedCategory;
    }

    public   async getAllCategories() {
        const categories = await prisma.category.findMany();
        return categories;
    }

public async AddProduct(requestBody: any, newPhotoUrl: string | null, subImagePaths: string[] = []) {
  const { name, description, categoryId } = requestBody;


    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) {
       throw new Error('Invalid category ID');
    }

    const product = await prisma.product.create({
          data: {
            name,
            description,
            imageUrl: newPhotoUrl || '',
            subImageUrls: subImagePaths,
            category: {
              connect: {
                id: parsedCategoryId
              }
            }
          },
      });


  const users = await prisma.user.findMany({
    select: { email: true },
  });

  const subject = "🚀 New Product Just Launched on Bazzar Spices!";
  const message = `
    Dear Bazzar Spices Member,

    We’re excited to announce that a brand-new product has just been added to our collection:

    🛍️ Product Name: ${name}
    📝 Description: ${description}

    Visit our website to learn more and stay tuned for more great updates!

    Thank you for being a valued member of the Bazzar Spices community.

    Warm regards,
    The Bazzar Spices Team
    bazzarspices@gmail.com
  `;

  for (const user of users) {
    const email = user.email?.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      try {
        await SendEmail({ email, subject, message });
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to send to ${email}:`, error);
      }
    }
  }
  return product;
}


public async UpdateProduct(requestBody: any, productId: number, newSubImageUrls?: string[]) {
  const { name, description, imageUrl, categoryId } = requestBody;
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      categoryId: true,
      imageUrl: true,
      subImageUrls: true
    }
  });

  if (!existingProduct) {
    throw new Error('Product not found');
  }
  const resolvedCategoryId = categoryId ? parseInt(categoryId) : existingProduct.categoryId;
  const resolvedImageUrl = imageUrl || existingProduct.imageUrl;
  const resolvedSubImages = newSubImageUrls || existingProduct.subImageUrls;
  const categoryExists = await prisma.category.findUnique({
    where: { id: resolvedCategoryId }
  });
  
  if (!categoryExists) {
    throw new Error('Invalid category ID');
  }
  if (newSubImageUrls) {
    await this.deleteOldImages(existingProduct.subImageUrls);
  }
  return await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      imageUrl: resolvedImageUrl,
      subImageUrls: resolvedSubImages,
      category: { connect: { id: resolvedCategoryId } },
      updatedAt: new Date(),
    }
  });
}


private async deleteOldImages(imagePaths: string[]) {
  const fs = require('fs').promises;
  const path = require('path');
  
  await Promise.all(imagePaths.map(async (imagePath) => {
    try {
      const fullPath = path.join(__dirname, '..', 'uploads', path.basename(imagePath));
      await fs.unlink(fullPath);
    } catch (err) {
      console.error(`Failed to delete image: ${imagePath}`, err);
    }
  }));
}


        
    public async RemoveProduct(productId: number) {
      await prisma.product.delete({
        where: { id: productId }
      });
    }
    
    public async getProductUsingid(id:number){
        const product=await prisma.product.findFirst({
        where: { id: id }
      });
      return product
    }

  public async getAllProductWithCategories() {
          const categories = await prisma.category.findMany({
            include: {
              products: true,
            },
         });
      return categories;
  }


    private async IsEmailAlreadyExist(email: string): Promise<boolean> {
      const user = await prisma.user.findFirst({
        where: {
          email: email,
        },
      });
      return !!user;
    }
  }
export const adminservices:AdminServices=new AdminServices();