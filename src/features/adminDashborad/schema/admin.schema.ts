import joi from "joi"

export const adminSchema= joi.object({
    name:joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().required()
})

export const categorySchema=joi.object({
    name:joi.string().required(),
})

export const productSchema= joi.object({
    name:joi.string().required(),
    description:joi.string().required(),
    imageUrl:joi.required(),
    categoryId :joi.number().required(),
    main_image:joi.optional()
})



export const UpdateSchema= joi.object({
    name:joi.string().optional(),
    description:joi.string().email().optional(),
    imageUrl:joi.string().optional(),
    categoryId :joi.number().optional()
})