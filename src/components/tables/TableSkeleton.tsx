"use client";

import React from "react";
import { Table, Pagination, Select, Space } from "antd";
import { ColumnType } from "antd/es/table";

interface TableSkeletonProps<T extends object> {
    columns: ColumnType<T>[];
    data: T[];
    isLoading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize: number) => void;
    };
}

export default function TableSkeleton<T extends { Student_ID: string }>({
                                                                            columns,
                                                                            data,
                                                                            isLoading,
                                                                            pagination,
                                                                        }: TableSkeletonProps<T>) {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: '100%', maxHeight: "100%" }}>
            <Table
                columns={columns}
                dataSource={isLoading ? [] : data}
                pagination={false}
                loading={isLoading}
                rowKey={(record) => String(record.Student_ID)}
                bordered
                style={{ flex: 1, maxHeight: "100%", overflow: "auto" }}
                sticky
            />
            <Space
                style={{
                    marginTop: "10px",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <Select
                    defaultValue={pagination.pageSize.toString()}
                    onChange={(value) => pagination.onChange(pagination.current, Number(value))}
                    options={[5, 10, 20, 50].map((size) => ({
                        value: size.toString(),
                        label: `Show ${size}`,
                    }))}
                    style={{ width: 120 }}
                />
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={(page, pageSize) => pagination.onChange(page, pageSize)}
                />
            </Space>
        </div>
    );
}
