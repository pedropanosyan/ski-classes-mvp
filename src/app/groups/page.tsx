"use client";

import { useEffect, useState } from "react";
import {Button, Flex, Table, Typography} from "antd";
import {ColumnsType, ColumnType} from "antd/es/table";
import Title from "antd/es/typography/Title";
import {useRouter} from "next/navigation";

interface Student {
    Student_ID: string;
    Age: string;
    First_Time_Skiing: string;
    Skiing_Experience_Years: string;
}

interface Group {
    key: string;
    groupId: string;
    students: Student[];
}

export default function GroupsPage() {
    const [groupData, setGroupData] = useState<Group[]>([]);
    const [currentPage, setCurrentPage] = useState(1); // Main table pagination
    const [pageSize, setPageSize] = useState(10); // Page size for main table
    const router = useRouter();

    useEffect(() => {
        const savedGroups = JSON.parse(localStorage.getItem("formattedGroups") || "[]");
        setGroupData(savedGroups);
    }, []);

    const columns: ColumnsType<Group> = [
        {
            title: "Group",
            dataIndex: "groupId",
            key: "groupId",
        },
    ];

    const expandedColumns: ColumnType<Student>[] = [
        {
            title: "Student ID",
            dataIndex: "Student_ID",
            key: "Student_ID",
            sorter: (a, b) => Number(a.Student_ID) - Number(b.Student_ID), // ✅ Ensure numeric comparison
        },
        {
            title: "Age",
            dataIndex: "Age",
            key: "Age",
            sorter: (a, b) => Number(a.Age) - Number(b.Age), // ✅ Ensure numeric comparison
        },
        { title: "First Time Skiing?", dataIndex: "First_Time_Skiing", key: "First_Time_Skiing" },
        { title: "Can Stop?", dataIndex: "Able_To_Stop", key: "Able_To_Stop" },
        { title: "Can Turn?", dataIndex: "Able_To_Turn", key: "Able_To_Turn" },
        { title: "Can Match Skis Across Hill?", dataIndex: "Able_To_Match_Skis_Across_Hill", key: "Able_To_Match_Skis_Across_Hill" },
        { title: "Can Match Skis in Shaping Turn?", dataIndex: "Able_To_Match_Skis_Shaping_Turn", key: "Able_To_Match_Skis_Shaping_Turn" },
        { title: "Last Terrain Skied", dataIndex: "Last_Terrain_Skied", key: "Last_Terrain_Skied" },
        {
            title: "Skiing Experience (Years)",
            dataIndex: "Skiing_Experience_Years",
            key: "Skiing_Experience_Years",
            sorter: (a, b) => Number(a.Skiing_Experience_Years) - Number(b.Skiing_Experience_Years), // ✅ Numeric sorting
        },
        { title: "Risk Preferences", dataIndex: "Risk_Preferences", key: "Risk_Preferences" },
        { title: "Time Since Last Skiing", dataIndex: "Last_Time_Since_Skiing", key: "Last_Time_Since_Skiing" },
    ];

    const goBack = () => {
        router.push("/");
    }

    return (
        <div style={{ padding: "20px"}}>
            <Flex justify={'space-between'}>
                <Title level={3}>Grupos de Estudiantes</Title>
                <Button type="primary" onClick={goBack}>Volver atras</Button>
            </Flex>
            <div style={{ marginTop: "20px", height: '85vh', overflow: 'auto' }}>
            <Table
                columns={columns}
                sticky
                dataSource={groupData}
                expandable={{
                    expandedRowRender: (record) => (
                        <Table
                            columns={expandedColumns}
                            dataSource={record.students.map((student, idx) => ({
                                ...student,
                                key: idx.toString(),
                            }))}
                            pagination={false}
                        />
                    ),
                }}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20"],
                }}
            />
            </div>
        </div>
    );
}
