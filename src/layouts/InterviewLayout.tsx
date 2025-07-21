import { Outlet } from "react-router-dom";
import { Icon } from "../components/Icon";
import { Divider, Typography } from "@mui/material";
import Button from "../components/Button";
import { useDispatch } from "react-redux";
import { exitInterviewModalStatus } from "../features/interview/reducer/interviewSlice";

function InterviewLayout() {
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-row w-screen items-center">
          <Icon name="logo" className="w-35 h-20" />
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ backgroundColor: "#000000" }}
          />
          <div className="flex flex-col ml-4">
            <Typography variant="h5" className="text-[#66676A]">
              AI Interview Platform
            </Typography>
            <Typography className="text-[#C4C5C9]">
              AI Powered Interview Suite
            </Typography>
          </div>
        </div>
        <button
          style={{
            display: "flex",
            background: "#FFFFFF",
            color: "#000000",
            padding: "0.8rem 1.5rem",
            borderRadius: "1.5rem",
            alignItems: "center",
            gap: "0.2rem",
            whiteSpace: "nowrap",
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => dispatch(exitInterviewModalStatus(true))}
        >
          Exit
        </button>
      </div>
      <div
        className="rounded-sm bg-white shadow"
        style={{ height: "calc(100vh - 10rem)", overflow: "hidden" }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default InterviewLayout;
