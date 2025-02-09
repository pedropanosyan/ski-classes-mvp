"use client";
import {Button, Flex, InputNumber, Modal} from "antd";
import React, {useEffect, useState} from "react";
import Papa from "papaparse";
import {ColumnType} from "antd/es/table";
import TableSkeleton from "@/components/tables/TableSkeleton";
import { useRouter } from "next/navigation";

export interface Student {
    Student_ID: string;
    Age: string;
    First_Time_Skiing: string;
    Able_To_Stop: string;
    Able_To_Turn: string;
    Able_To_Match_Skis_Across_Hill: string;
    Able_To_Match_Skis_Shaping_Turn: string;
    Last_Terrain_Skied: string;
    Skiing_Experience_Years: string;
    Risk_Preferences: string;
    Last_Time_Since_Skiing: string;
}


export default function Home() {
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState(6);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingGroups, setLoadingGroups] = useState(false);

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const router = useRouter();

    const handlePaginationChange = (page: number, pageSize: number) => {
        setPagination((prev) => ({ ...prev, current: page, pageSize }));
    };

    useEffect(() => {
        fetch("/students.csv")
            .then((response) => response.text())
            .then((csv) => {
                const parsedData = Papa.parse<Student>(csv, {
                    header: true,
                    skipEmptyLines: true,
                }).data;
                setStudents(parsedData);
                setPagination((prev) => ({
                    ...prev,
                    total: parsedData.length,
                }));
                setLoading(false);
            });
    }, []);

    const columns: ColumnType<Student>[] = [
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

    const handleGenerateClasses = async () => {
        setLoadingGroups(true);
        const response = await fetch("/api/group-students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ students, groupSize: size }),
        });

        const data = await response.json();

        const formattedData = data.groups.map((group: Student[], index: number) => ({
            key: index.toString(),
            groupId: `Group ${index + 1}`,
            students: group,
        }));

        localStorage.setItem("formattedGroups", JSON.stringify(formattedData));
        setLoadingGroups(false);
        router.push("/groups");

    }

    const existingGroups = typeof window !== "undefined"
        ? localStorage.getItem("formattedGroups")
        : null;
  return (
      <>
          <div style={{ padding: '32px 64px'}}>
              <Flex vertical gap={'16px'}>
              <Flex gap={'16px'}>
                  <Button type={'primary'} onClick={() => setOpen(true)}>
                      {existingGroups ?
                          'Regenerate classes' : 'Generate classes'
                      }
                  </Button>
                  {existingGroups && (
                        <Button
                            onClick={() => router.push("/groups")}
                        >
                            View groups
                        </Button>
                  )}
              </Flex>
                  <div style={{ height: "80vh" }}>
                      <TableSkeleton
                          columns={columns}
                          data={students.slice(
                              (pagination.current - 1) * pagination.pageSize,
                              pagination.current * pagination.pageSize
                          )}
                          isLoading={loading}
                          pagination={{
                              ...pagination,
                              onChange: handlePaginationChange,
                          }}
                      />
                  </div>
              </Flex>
          </div>
          <Modal
              title={'Generate classes'}
              open={open}
              onCancel={() => setOpen(false)}
              okButtonProps={{ disabled : size < 1, loading: loadingGroups }}
              onOk={handleGenerateClasses}
          >
                <div>
                    <p>Please pick the class size</p>
                    <InputNumber
                        min={1}
                        max={10}
                        value={size}
                        onChange={(value) => setSize(value as number)}
                    />
                </div>
          </Modal>
      </>
  );
}
