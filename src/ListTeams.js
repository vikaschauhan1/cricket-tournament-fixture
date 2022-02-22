import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Parser from "html-react-parser";
import { addMinutes, getDateTime, getTime } from "./helper";
import { MINUTES_PER_OVER, START_TIME } from "./constant";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables(props) {
  const [rows, setRows] = useState([]);
  const { setSchedule, inningsOver } = props;
  const minutesPerMatch = inningsOver * 2 * MINUTES_PER_OVER;

  useEffect(() => {
    const { data: sceduleData } = props;
    setRows(sceduleData);
  }, [props.data]);

  const handleDragEnd = (e) => {
    if (!e.destination) return;
    let tempData = Array.from(rows);
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setSchedule(tempData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Action</StyledTableCell>
              <StyledTableCell>Team 1</StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>Team 2</StyledTableCell>
              <StyledTableCell>Time</StyledTableCell>
            </TableRow>
          </TableHead>
          <Droppable droppableId="droppable-1">
            {(provider) => (
              <TableBody ref={provider.innerRef} {...provider.droppableProps}>
                {rows.map((row, index) => (
                  <Draggable
                    key={row.id}
                    draggableId={`droppable${row.id}`}
                    index={index}
                  >
                    {(provider) => (
                      <StyledTableRow
                        {...provider.draggableProps}
                        ref={provider.innerRef}
                      >
                        <StyledTableCell {...provider.dragHandleProps}>
                          {" "}
                          ={" "}
                        </StyledTableCell>
                        <StyledTableCell>{Parser(row.team1)}</StyledTableCell>
                        <StyledTableCell>vs</StyledTableCell>
                        <StyledTableCell>{Parser(row.team2)}</StyledTableCell>
                        <StyledTableCell>
                          {getTime(
                            addMinutes(
                              getDateTime(START_TIME),
                              minutesPerMatch * index
                            )
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    )}
                  </Draggable>
                ))}
                {provider.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </TableContainer>
    </DragDropContext>
  );
}
