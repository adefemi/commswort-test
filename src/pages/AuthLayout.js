import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "react-icons-kit";
import { ic_power_settings_new } from "react-icons-kit/md/ic_power_settings_new";
import { withApollo } from "react-apollo";
import gql from "graphql-tag";
import { errorHandler } from "../utils";
import { Notification } from "../components/notification";

const getProjects = gql`
  query LoadProjects {
    loadProject {
      title
    }
  }
`;

function AuthLayout(props) {
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState("home");

  useEffect(() => {
    checkIfLoggedIn();
    checkActiveRoute();
  }, [props.children, props.location.pathname]);

  const checkActiveRoute = () => {
    const tempRoute = props.location.pathname;
    switch (tempRoute) {
      case "/":
      case "":
        setActiveRoute("home");
        break;
      case "/create-project":
        setActiveRoute("create");
        break;
      default:
        setActiveRoute("view");
    }
  };

  const checkSession = () => {
    props.client
      .query({
        query: getProjects
      })
      .catch(err => {
        const checkError = errorHandler(err);
        if (checkError.netError) {
          setTimeout(() => checkSession(), 3000);
        } else {
          Notification.bubble({
            type: "error",
            content: "Your session has expired"
          });
          localStorage.removeItem("ctoken");
          props.history.push("/login");
        }
      });
  };

  const checkIfLoggedIn = () => {
    const token = localStorage.getItem("ctoken");
    if (!token) {
      props.history.push("/login");
    } else {
      checkSession();
      setLoading(false);
    }
  };
  if (loading) {
    return <h1>Loading...</h1>;
  }

  const logout = () => {
    localStorage.removeItem("ctoken");
    props.history.push("/login");
  };

  return (
    <div>
      <div className="header">
        <div className="title">
          {activeRoute === "home" && "Map"}
          {activeRoute === "create" && "Create Project"}
          {activeRoute === "view" && "View Project"}
        </div>
        <div className="right-content">
          {activeRoute !== "view" && (
            <Link to="/view-project">View Projects</Link>
          )}
          {activeRoute !== "home" && <Link to="/">View Map</Link>}
          {activeRoute !== "create" && (
            <Link to="/create-project">
              <button>Create Project</button>
            </Link>
          )}

          <div className="logout" title="logout">
            <Icon icon={ic_power_settings_new} size={20} onClick={logout} />
          </div>
        </div>
      </div>
      {props.children}
    </div>
  );
}

export default withApollo(AuthLayout);
