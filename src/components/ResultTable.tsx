import React, { useMemo } from 'react'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material'

type ResultTableProps = {
  result: Result
  selectedIndex?: number
  onClick?: (index: number) => void
}

export const ResultTable = ({
  result,
  onClick,
  selectedIndex,
}: ResultTableProps) => {
  const columns = useMemo(() => {
    const params = result.segments[0]?.params
    if (params) return Object.keys(params)
    else return []
  }, [result])
  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>No</TableCell>
          <TableCell>Name</TableCell>
          {columns.map((column) => (
            <TableCell key={column}>
              {column[0].toUpperCase() + column.slice(1)}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {result.segments.map((x, i) => (
          <TableRow
            key={i}
            selected={i === selectedIndex}
            onClick={() => onClick?.(i)}
          >
            <TableCell>{i + 1}</TableCell>
            <TableCell>{x.name}</TableCell>
            {columns.map((column) => (
              <TableCell key={column}>{x.params[column].toString()}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
