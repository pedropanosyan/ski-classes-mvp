import { kmeans } from "ml-kmeans";

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

/**
 * Groups students into clusters using K-Means clustering with size constraints.
 * @param students Array of student objects with numeric attributes for clustering.
 * @param groupSize Number of students per group.
 * @returns Array of grouped students.
 */
export function groupStudents(students: Student[], groupSize: number): Student[][] {
    const numGroups = Math.ceil(students.length / groupSize);

    // Preprocess data for clustering
    const data = students.map((student) => [
        parseInt(student.Age, 10) || 0,
        parseInt(student.Skiing_Experience_Years, 10) || 0,
        parseInt(student.First_Time_Skiing, 10) || 0,
        parseInt(student.Able_To_Stop, 10) || 0,
        parseInt(student.Able_To_Turn, 10) || 0,
        parseInt(student.Able_To_Match_Skis_Across_Hill, 10) || 0,
        parseInt(student.Able_To_Match_Skis_Shaping_Turn, 10) || 0,
    ]);

    // Apply K-Means clustering
    const kmeansResult = kmeans(data, numGroups, { initialization: "kmeans++" });
    const clusters = kmeansResult.clusters;

    // Initialize groups
    const groups: Student[][] = Array.from({ length: numGroups }, () => []);

    // Assign students to groups based on K-Means clusters
    students.forEach((student, index) => {
        const groupIndex = clusters[index];
        groups[groupIndex].push(student);
    });

    // Balance groups to ensure exact group size
    const balancedGroups = balanceGroups(groups, groupSize);

    return balancedGroups;
}

/**
 * Balances groups to ensure each group has exactly the specified size.
 * @param groups Array of groups (arrays of students).
 * @param groupSize Desired size for each group.
 * @returns Balanced groups.
 */
function balanceGroups(groups: Student[][], groupSize: number): Student[][] {
    const balancedGroups: Student[][] = [];
    const allStudents: Student[] = groups.flat();

    let currentGroup: Student[] = [];
    for (const student of allStudents) {
        if (currentGroup.length < groupSize) {
            currentGroup.push(student);
        } else {
            balancedGroups.push(currentGroup);
            currentGroup = [student];
        }
    }

    // Add the last group if it has students
    if (currentGroup.length > 0) {
        balancedGroups.push(currentGroup);
    }

    return balancedGroups;
}