'use client'

import React from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Image from 'next/image'
import { blog_data } from '@/Assets/assets'

const BlogItem = () => {
    const columns: GridColDef[] = [
        {
            field: 'image',
            headerName: 'Image',
            width: 120,
            renderCell: (params) => (
                <Image
                    src={params.value}
                    alt="blog image"
                    width={70}
                    height={70}
                    className="rounded"
                />
            ),
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
        },
        {
            field: 'author',
            headerName: 'Author',
            width: 150,
        },
    ]

    const rows = blog_data.map((item) => ({
        id: item.id,
        image: item.image,
        title: item.title,
        category: item.category,
        author: item.author,
        date: item.date,
    }))

    return (
        <div style={{ height: 600, width: '100%' }} className="p-5">
            <h2 className="text-xl font-semibold mb-4">Blog Data</h2>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[5, 10]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                }}
                disableRowSelectionOnClick
            />
        </div>
    )
}

export default BlogItem
