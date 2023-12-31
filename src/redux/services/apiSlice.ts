import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product, FreightItem, Position, CountingList, VoiceList } from '@/types'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '../api'
    }),
    tagTypes: ['Products', 'Freights', 'Positions'],
    endpoints: (builder) => ({
        getProducts: builder.query<Product[], null>({
            query: () => '/products',
            providesTags: ["Products"]
        }),
        getProductById: builder.query<Product, {id: string}>({
            query: (id) => `/products/${id}`
        }),
        createProduct: builder.mutation({
            query: (newProduct) => ({
                url: '/products',
                method: "POST",
                body: newProduct
            }),
            invalidatesTags: ["Products"]
        }),
        getFreigths: builder.query<FreightItem[], null>({
            query: () => '/freights',
            providesTags: ["Freights"]
        }),
        createFreights: builder.mutation({
            query: (results) => ({
                url: '/freights',
                method: "POST",
                body: results
            }),
            invalidatesTags: ["Freights"],
        }),
        getCounting: builder.query<CountingList, null>({
            query: () => '/counting'
        }),
        getVoices: builder.query<VoiceList, null>({
            query: () => '/voices'
        }),
        getPositions: builder.query<Position[], null>({
            query: () => '/positions',
            providesTags: ["Positions"]
        }),
        createPosition: builder.mutation({
            query: ({product, position}) => ({
                url: '/positions',
                method: "POST",
                body: {product, position}
            }),
            invalidatesTags: ["Positions"],
        }),
        clearPosition: builder.mutation({
            query: (position) => ({
                url: '/positions',
                method: "PUT",
                body: position
            }),
            invalidatesTags: ["Positions"],
        }),
    })
})

export const { 
    useGetProductsQuery, 
    useGetProductByIdQuery, 
    useCreateProductMutation, 
    useGetFreigthsQuery,
    useCreateFreightsMutation,
    useGetCountingQuery,
    useGetVoicesQuery,
    useGetPositionsQuery,
    useCreatePositionMutation,
    useClearPositionMutation
} = apiSlice;