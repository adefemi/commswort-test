import React, { useEffect, useState } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import "../styles.css";
import gql from "graphql-tag";
import Loader from "react-loader-spinner";
import { withApollo } from "react-apollo";
import { Notification } from "../components/notification";
import { errorHandler } from "../utils";

const getLocations = gql`
  query LoadLocations {
    loadLocations {
      location
      latitude
      longitude
    }
  }
`;

function MapPage(props) {
  const [locations, setLocations] = useState([]);
  const [checkCount, setCheckCount] = useState(0);
  const [bound, setBound] = useState(props.google.maps.LatLngBounds());

  const getLocationContents = () => {
    props.client
      .query({
        query: getLocations
      })
      .then(
        res => {
          try {
            setLocations(res.data.loadLocations);
          } catch (e) {
            Notification.bubble({
              type: "error",
              content: "An error occurred while fetching locations"
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
            setTimeout(() => getLocationContents(), 3000);
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
  useEffect(() => {
    let bounds = new props.google.maps.LatLngBounds();
    for (let i = 0; i < locations.length; i++) {
      const point = {
        lat: parseFloat(locations[i].latitude),
        lng: parseFloat(locations[i].longitude)
      };
      bounds.extend(point);
    }
    setBound(bounds);
  }, [locations]);

  return (
    <div className="map-main">
      <div className="map-view">
        <Map
          google={props.google}
          onReady={getLocationContents}
          zoom={10}
          center={{
            lat: locations[0] ? locations[0].latitude : 5.9101,
            lng: locations[0] ? locations[0].longitude : 7.9999
          }}
          bounds={bound}
        >
          {locations.map((location, index) => (
            <Marker
              title={location.location}
              name={location.location}
              key={index}
              position={{ lat: location.latitude, lng: location.longitude }}
              animation={1}
            />
          ))}
        </Map>
      </div>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDTpDMmyWINZhlX-zFNEXltuDmQ9WLhBuQ",
  LoadingContainer: () => (
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
  )
})(withApollo(MapPage));
