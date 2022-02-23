import React, { useState } from "react";
import { render } from "react-dom";
import "./style.css";
import { WithContext as ReactTags } from "react-tag-input";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import PrintIcon from "@mui/icons-material/Print";
import Container from "@mui/material/Container";

import getFixture from "./helper";
import ListTeams from "./ListTeams";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "right",
  color: theme.palette.text.secondary,
  border: "1px solid black",
  borderRadius: "8px",
}));

const App = () => {
  const [tags, setTags] = useState([]);
  const [teamNames, setTeamNames] = useState([]);
  const [matchPerTeam, setMatchPerTeam] = useState();
  const [inningsOver, setInningsOver] = useState();
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState("");

  const handleDelete = (i) => {
    setTags(tags.filter((_, index) => index !== i));
    setTeamNames(teamNames.filter((_, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTeamNames((oldState) => [...oldState, tag.text]);
    setTags([...tags, tag]);
  };

  const handleFixture = () => {
    const result = getFixture(teamNames, matchPerTeam);
    if (result.error) {
      setError(result.message);
      setSchedule([]);
    } else {
      setSchedule(result.data);
      setError("");
    }
  };

  const handleDisabled = () => {
    return !teamNames.length || !matchPerTeam || (!inningsOver || inningsOver == 0);
  };

  return (
    <div className="app">
      <Container
        style={{
          border: "1px solid black",
          borderRadius: "16px",
          padding: "30px",
        }}
      >
        <Box
          sx={{
            width: 600,
            maxWidth: "100%",
          }}
        >
          <ReactTags
            placeholder={"Enter name of teams"}
            tags={tags}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            inputFieldPosition="bottom"
            autocomplete
            editable
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            id="standard-basic"
            placeholder="Number of matches"
            label="Number of matches per team"
            type="number"
            variant="standard"
            value={matchPerTeam}
            onChange={(e) => setMatchPerTeam(e.target.value)}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            id="standard-basic"
            placeholder="Overs"
            label="Overs per innings"
            type="number"
            variant="standard"
            value={inningsOver}
            onChange={(e) => setInningsOver(e.target.value)}
          />
        </Box>

        {error && !schedule.length && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}
        <Box style={{ marginLeft: "-10px" }}>
          <Button
            sx={{
              margin: "10px",
            }}
            variant="contained"
            color="success"
            disabled={handleDisabled()}
            onClick={() => handleFixture()}
          >
            Get Fixture
          </Button>
        </Box>

        {!error && schedule && schedule.length > 0 && (
          <>
            <Stack spacing={1} direction="row" style={{ float: "right" }}>
              <Item style={{marginBottom: '5px'}}>Total matches: {schedule.length}</Item>
              <Item
                style={{ cursor: "pointer",marginBottom: '5px' }}
                onClick={() => window.print()}
              >
                <PrintIcon />
              </Item>
            </Stack>
            <ListTeams data={schedule} setSchedule={setSchedule} inningsOver={inningsOver} />
          </>
        )}
      </Container>
    </div>
  );
};

render(<App />, document.getElementById("root"));
