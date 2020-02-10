import React, { useState } from "react";
import "../styles.css";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { errorHandler } from "../utils";
import { Notification } from "../components/notification";
import moment from "moment";
import Loader from "react-loader-spinner";
import NotFound from "../components/notFound";

const getProjects = gql`
  query LoadProjects {
    loadProject {
      title
      budget
      startDate
      endDate
      contractorName
      contractorAddress
    }
  }
`;

function ViewProject(props) {
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [checkCount, setCheckCount] = useState(0);

  const getProjectContents = () => {
    props.client
      .query({
        query: getProjects
      })
      .then(
        res => {
          try {
            setProjects(res.data.loadProject);
            setFetching(false);
          } catch (e) {
            Notification.bubble({
              type: "error",
              content: "An error occurred while fetching projects"
            });
          }
        },
        err => {
          const checkError = errorHandler(err);
          if (checkError.netError) {
            if (checkCount > 3) {
              Notification.bubble({
                type: "error",
                content: checkError.message
              });
              return;
            }
            setTimeout(() => getProjectContents(), 3000);
            setCheckCount(checkCount + 1);
          } else {
            Notification.bubble({
              type: "error",
              content: "Your session has expired"
            });
            localStorage.removeItem("ctoken");
            props.history.push("/login");
          }
        }
      );
  };

  useState(() => {
    props.client.cache.reset();
    getProjectContents();
  }, []);

  if (fetching) {
    return (
      <div className="view-proj-container">
        <br />
        <Loader
          type="Oval"
          color="#00BFFF"
          height={20}
          width={20}
          // timeout={3000}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="view-proj-container">
        {projects.length < 1 ? (
          <NotFound heading="No project is available at this period" />
        ) : (
          <div className="proj-list">
            {projects.map((project, index) => (
              <ProjectCard {...project} key={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default withApollo(ViewProject);

const formatDate = dateString => {
  let tempDate = new Date(dateString);
  if (tempDate.toString().toLowerCase() === "invalid date") {
    return dateString;
  } else {
    return moment(tempDate).format("YYYY-MM-DD");
  }
};

const ProjectCard = ({
  title,
  budget,
  contractorName,
  contractorAddress,
  startDate,
  endDate
}) => {
  return (
    <div className="project-card">
      <div>
        <div className="flex justify-between">
          <div className="title">{title}</div>
          <div className="budget">${budget}</div>
        </div>
        <br />
        <div>
          <small>Contractor Name</small>
          <div className="info">{contractorName}</div>
        </div>
        <div>
          <small>Contractor Address</small>
          <div className="info">{contractorAddress}</div>
        </div>
      </div>
      <br />
      <div className="flex align-center justify-between">
        <div>
          <small>Start Date</small>
          <div className="content">{formatDate(startDate)}</div>
        </div>
        <div>
          <small>End Date</small>
          <div className="content">{formatDate(endDate)}</div>
        </div>
      </div>
    </div>
  );
};
