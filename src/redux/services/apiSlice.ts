import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product, FreightItem, countingList, voiceList } from '@/types'


export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '../api'
    }),
    tagTypes: ['Products', 'Freights'],
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], null>({
            query: () => '/products',
            providesTags: ["Products"],
        }),
        getProductById: builder.query<Product, {id: string}>({
            query: (id) => `/products/${id}`
        }),
        createProduct: builder.mutation({
            query: (newProduct) => ({
                url: '/products',
                method: "POST",
                body: newProduct,
            }),
            invalidatesTags: ["Products"],
        }),
        getFreigths: builder.query<FreightItem[], null>({
            query: () => '/freights',
            providesTags: ["Freights"],
        }),
        createFreights: builder.mutation({
            query: (freights) => ({
                url: '/freights',
                method: "POST",
                body: freights,
            }),
            invalidatesTags: ["Freights"],
        }),
        getCounting: builder.query<countingList, null>({
            query: () => '/counting',
        }),
        getVoices: builder.query<voiceList, null>({
            query: () => '/voices',
        })
    })
})

export const { 
    useGetProductsQuery, 
    useGetProductByIdQuery, 
    useCreateProductMutation, 
    useGetFreigthsQuery,
    useCreateFreightsMutation,
    useGetCountingQuery,
    useGetVoicesQuery
} = apiSlice;