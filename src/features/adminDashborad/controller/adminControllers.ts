import express,{Request,Response,NextFunction} from "express"
import { adminservices } from "../../../services/admin.services";
import { HTTB_STATUS } from "../../../globals/constants/http";
import { date } from "joi";
class AdminControllers{
    public async addAdmin(req:Request,res:Response,next:NextFunction){
        const token=await adminservices.register(req.body)
        res.status(HTTB_STATUS.OK).json({
            message:"Admin Add successfly",
            data:token
        })   
    }
    public async addCategory(req:Request,res:Response,next:NextFunction){
      console.log("Body Received:", req.body);
        const category=await adminservices.AddCategory(req.body)
        res.status(200).json({
            message:"category Add successfly",
            data:category
        }) 
    }
    public async editCategory(req: Request, res: Response, next: NextFunction) {
          const updated = await adminservices.updateCategory(req.body, Number(req.params.id));
          res.status(HTTB_STATUS.OK).json({
            message: "Category updated successfully",
            data: updated
          });
      }
    
      public async deleteCategory(req: Request, res: Response, next: NextFunction) {
             await adminservices.removeCategory(Number(req.params.id));
          res.status(HTTB_STATUS.OK).json({
            message: "Category deleted successfully",
          });
      }
    
      public async getAllGategory(req: Request, res: Response, next: NextFunction) {
          const categories = await adminservices.getAllCategories();
          res.status(HTTB_STATUS.OK).json({
            message: "Categories retrieved successfully",
            data: categories,
          });
      }

public async addProduct(req: Request, res: Response, next: NextFunction) {
  console.log(req.body)
  const files = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const mainImage = files?.['imageUrl']?.[0] || null;
  const subImages = files?.['subImageUrls'] || [];

  const mainPhotoPath = mainImage ? mainImage.path : null;
  const subImagePaths = subImages.map((img) => img.path);

  const product = await adminservices.AddProduct(req.body, mainPhotoPath, subImagePaths);

  res.status(HTTB_STATUS.OK).json({
    message: "Product added successfully",
    data: product,
  });
}


    
      public async EditProduct(req: Request, res: Response, next: NextFunction) {
          const files = req.files as { [fieldname: string]: Express.Multer.File[] };
          const mainImage = files?.['imageUrl']?.[0];
          const subImages = files?.['subImageUrls'] || [];
          const mainImagePath = mainImage?.path;
          const subImagePaths = subImages.map(img => img.path);
          const updatedProduct = await adminservices.UpdateProduct(
            { ...req.body, imageUrl: mainImagePath },
            Number(req.params.id),
            subImagePaths 
          );
          res.status(HTTB_STATUS.OK).json({
            message: "Product updated successfully",
            data: updatedProduct
          });
      }
    
    public async deleteProduct(req:Request,res:Response,next:NextFunction){
        await adminservices.RemoveProduct(Number(req.params.id))
        res.status(HTTB_STATUS.OK).json({
            message: "product Deleted successfully",
          });
    }

    public async getproductUsingId(req:Request,res:Response,next:NextFunction){
        const product =await adminservices.getProductUsingid(Number(req.params.id))
        res.status(HTTB_STATUS.OK).json({
            message: "product ",
            data:product
          });
    }

  public async getAllProduct(req: Request, res: Response, next: NextFunction) {
    const categoriesWithProducts = await adminservices.getAllProductWithCategories();
      res.status(HTTB_STATUS.OK).json({
        message: "Categories with products retrieved successfully",
        data: categoriesWithProducts,
      });
  }
}


export const admincontrollers:AdminControllers=new AdminControllers();