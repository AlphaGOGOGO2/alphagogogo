
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VisitStat {
  date: string;
  count: number;
}

interface VisitorStatsTableProps {
  stats: VisitStat[];
}

export function VisitorStatsTable({ stats }: VisitorStatsTableProps) {
  if (stats.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>이번 달 일별 방문자 통계</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>날짜</TableHead>
              <TableHead className="text-right">방문자 수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat.date}>
                <TableCell>{stat.date}</TableCell>
                <TableCell className="text-right">{stat.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
