/*
 * @Author: Leo
 * @Date: 2022-08-01 17:47:52
 * @LastEditors: Leo
 * @LastEditTime: 2022-08-02 16:52:43
 * @FilePath: \Accuenergy-Coding-Test\src\components\GoogleMap\Map.tsx
 * @Description:
 */
import React from 'react';
import {
    GoogleMap,
    LoadScript,
    MarkerF,
  } from "@react-google-maps/api";
import { Center } from '../../views/Home/Home';
import { SearchedPlaces } from '../../views/Home/Home';

  export type Libraries = (
    | "drawing"
    | "geometry"
    | "localContext"
    | "places"
    | "visualization"
  )[];
  const libraries: Libraries = ["places"];

  interface GoogleMapsProp {
    center: Center;
    searchedPlaces: Array<SearchedPlaces>;
    onMapLoad: () => void;
  }

  const containerStyle = {
    width: "100%",
    height: "800px",
  };

const Map: React.FC<GoogleMapsProp> = ({center = {
    // 温莎大学图书馆 默认地址
    lat: 42.307,
    lng: -83.068,
}, onMapLoad, searchedPlaces}) => {

    return (
        <LoadScript
          googleMapsApiKey="AIzaSyCKR_7S6WE5ETziYlastsHnmKuvELeFTW4"
          libraries={libraries}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={16}
            onLoad={onMapLoad}
          >
            {
                searchedPlaces.length ?
                searchedPlaces.map((marker, index) => (<MarkerF key={index} position={marker.position}/>)) :
                <MarkerF position={center} />
            }
          </GoogleMap>
        </LoadScript>
      );
};

export default Map;