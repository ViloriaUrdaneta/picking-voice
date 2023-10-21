import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product, FreightItem, Position, countingList, voiceList } from '@/types'


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
            query: (results) => ({
                url: '/freights',
                method: "POST",
                body: results,
            }),
            invalidatesTags: ["Freights"],
        }),
        getCounting: builder.query<countingList, null>({
            query: () => '/counting',
        }),
        getVoices: builder.query<voiceList, null>({
            query: () => '/voices',
        }),
        getPositions: builder.query<Position[], null>({
            query: () => '/positions',
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