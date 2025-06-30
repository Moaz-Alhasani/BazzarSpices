import express, { Application } from 'express'
import { asyncWapper } from '../../../globals/middlware/error.middlware';
import { admincontrollers } from '../controller/adminControllers';
import { validateSchema } from '../../../globals/middlware/validate.middlware';
import { adminSchema, categorySchema, productSchema, UpdateSchema } from '../schema/admin.schema';
import upload from '../../../globals/constants/mluter';
import { checkPermission, vrefiyUser } from '../../../globals/middlware/auth.middlware';

const adminRouter=express.Router();

adminRouter.post('/',validateSchema(adminSchema),asyncWapper(admincontrollers.addAdmin))
adminRouter.post('/addCategory',vrefiyUser,checkPermission('ADMIN'),validateSchema(categorySchema),asyncWapper(admincontrollers.addCategory))
adminRouter.put('/edit/:id',vrefiyUser,checkPermission('ADMIN'),validateSchema(categorySchema),asyncWapper(admincontrollers.editCategory))
adminRouter.delete('/delete/:id',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.deleteCategory))
adminRouter.get('/getcategores',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.getAllGategory))




adminRouter.post(
  '/addproduct',
  vrefiyUser,
  checkPermission('ADMIN'),
  upload.fields([
    { name: 'imageUrl', maxCount: 1 },        
    { name: 'subImageUrls', maxCount: 3 },   
  ]),
  asyncWapper(admincontrollers.addProduct)
);
adminRouter.put('/editproduct/:id',vrefiyUser,checkPermission('ADMIN'),  upload.fields([
    { name: 'imageUrl', maxCount: 1 }, 
    { name: 'subImageUrls', maxCount: 3 }, 
  ]),asyncWapper(admincontrollers.EditProduct))

  
adminRouter.delete('/deleteproduct/:id',vrefiyUser,checkPermission('ADMIN'),asyncWapper(admincontrollers.deleteProduct))
adminRouter.get('/getAllProduct',asyncWapper(admincontrollers.getAllProduct))
adminRouter.get('/product/:id',asyncWapper(admincontrollers.getproductUsingId))




export default adminRouter