import React, { useState } from "react";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { Notification } from "../components/notification";
import { errorHandler } from "../utils";
import Loader from "react-loader-spinner";

const createProject = gql`
  mutation createProject($project: CreateProjectType!) {
    createProject(project: $project) {
      status
      message
    }
  }
`;

function CreateProject(props) {
  const [data, setData] = useState({});
  const [submit, setSubmit] = useState(false);

  const onChange = e => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const onSubmit = e => {
    e.preventDefault();
    setSubmit(true);
    props.client
      .mutate({
        mutation: createProject,
        variables: { project: { ...data } }
      })
      .then(
        _ => {
          Notification.bubble({
            type: "success",
            content: "Project created successfully. You should add another..."
          });
          setData({});
          setSubmit(false);
        },
        err => {
          Notification.bubble({
            type: "error",
            content: errorHandler(err).message
          });
          setSubmit(false);
        }
      );
  };

  return (
    <div>
      <div className="view-proj-container">
        <div className="project-con">
          <h3>Create a project</h3>
          <small>
            Provide information that will enable us project the best solution
            for you...
          </small>

          <form onSubmit={onSubmit}>
            <label>
              <span>Title</span>
              <input
                type="text"
                value={data.title || ""}
                onChange={onChange}
                name="title"
                placeholder="Enter your project title"
                required
              />
            </label>
            <label>
              <span>Budget</span>
              <input
                type="number"
                value={data.budget}
                onChange={onChange}
                name="budget"
                placeholder="Whats your budget"
                required
              />
            </label>
            <div className="grid-input-2">
              <label>
                <span>Start Date</span>
                <input
                  type="date"
                  value={data.startDate}
                  onChange={onChange}
                  name="startDate"
                  placeholder="When is project starting..."
                  required
                />
              </label>
              <label>
                <span>End Date</span>
                <input
                  type="date"
                  value={data.endDate}
                  onChange={onChange}
                  name="endDate"
                  placeholder="When is project ending..."
                  required
                />
              </label>
            </div>
            <label>
              <span>Contractor Name</span>
              <input
                type="text"
                value={data.contractorName || ""}
                onChange={onChange}
                name="contractorName"
                placeholder="Provide the contractor's name"
                required
              />
            </label>
            <label>
              <span>Contractor Address</span>
              <input
                type="text"
                value={data.contractorAddress || ""}
                onChange={onChange}
                name="contractorAddress"
                placeholder="Enter the contractor's address"
                required
              />
            </label>

            <button type="submit" className="submit-button" disabled={submit}>
              {!submit ? (
                "Submit"
              ) : (
                <Loader
                  type="ThreeDots"
                  color="#ffffff"
                  height={30}
                  width={30}
                  // timeout={3000}
                />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withApollo(CreateProject);
