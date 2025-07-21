import { Box, Divider, Typography } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { type FC } from "react";

export interface CurrentQuestionProps {
  currentQuestion: any;
  questionTotalCount: number;
  nextDisabled: boolean;
  onClickNext: () => void;
  questionOver: boolean;
}

const CurrentQuestion: FC<CurrentQuestionProps> = ({
  questionTotalCount,
  currentQuestion,
  onClickNext,
  nextDisabled,
  questionOver
}) => {
  const getNextQuestion = () => {
    if(nextDisabled) return;
    onClickNext();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "column", md: "column", lg: "row" },
        alignItems: { xs: "flex-start", md: "fflex-start" },
        padding: "1rem 0rem",
        justifyContent: "space-between",
        gap: "1.5rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          paddingLeft: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
         {!questionOver && <><Typography variant="h4" fontWeight={700}>
            Q{currentQuestion?.number ?? "0"}
          </Typography>
          <Typography>/{questionTotalCount}</Typography></>}
        </Box>
        <Divider orientation="vertical" flexItem />
        {!questionOver ? <Typography align="left">
          {currentQuestion?.question ?? ""}
        </Typography>:<Typography align="left">Interview Finished</Typography>}
      </Box>
      {!questionOver && <button
        onClick={getNextQuestion}
        style={{
          display: "flex",
          background: nextDisabled ? "#ddd" : "#32337B",
          padding: "0.8rem 1rem",
          borderRadius: "1.5rem",
          color: "white",
          alignItems: "center",
          gap: "0.2rem",
          whiteSpace: "nowrap",
          cursor: nextDisabled ? "not-allowed" : "pointer",
        }}
      >
        <Typography style={{ textAlign: "left" }}> Next Question </Typography>
        <ChevronRight size={25} />
      </button>}
    </Box>
  );
};

export default CurrentQuestion;
