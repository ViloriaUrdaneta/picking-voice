import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product } from '@/types'


export const apiSlice =  createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '../api'
    }),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], null>({
            query: () => '/products',
            providesTags: ["Products"],
        }),
        getProductById: builder.query<Product, {id: string}>({
            query: (id) => `/products/${id}`
        }),
        createProfuct: builder.mutation({
            query: (newProduct) => ({
                url: '/products',
                method: "POST",
                body: newProduct,
            }),
            invalidatesTags: ["Products"],
        })
    })
})

export const { useGetProductsQuery, useGetProductByIdQuery, useCreateProfuctMutation } = apiSlice;