/*
 * @Author: Leo
 * @Date: 2022-08-01 17:39:29
 * @LastEditors: Leo
 * @LastEditTime: 2022-08-02 16:59:14
 * @FilePath: \Accuenergy-Coding-Test\src\components\Input\PlaceInput.tsx
 * @Description:
 */
import React, { SetStateAction, useRef, useState } from 'react';
import { Input, InputRef, message } from 'antd';
import { Autocomplete, LoadScript } from '@react-google-maps/api';
import { Libraries } from '../GoogleMap/Map';
import { Center } from '../../views/Home/Home';
import { SearchedPlaces } from '../../views/Home/Home';
import { v4 as uuidv4 } from 'uuid';

const { Search } = Input;
const libraries: Libraries = ["places"];

interface PlaceInputProp {
    setMapCenter: React.Dispatch<SetStateAction<Center>>
    setLastestPlace: React.Dispatch<SetStateAction<string>>
    setSearchedPlaces: React.Dispatch<SetStateAction<Array<SearchedPlaces>>>
}

const PlaceInput: React.FC<PlaceInputProp> = ({ setMapCenter, setLastestPlace, setSearchedPlaces }) => {
    const search: React.RefObject<InputRef> = useRef(null);
    const [value, setValue] = useState('');
    const [autoComplete, setAutoComplete] = useState<Autocomplete | null>(null);
    const [location, setLocation] = useState<any>(null);

    const onSearch = () => {
        if (location !== null) {
            const lat = location?.geometry?.location?.lat();
            const lng = location?.geometry?.location?.lng();
            if (lat && lng) {
                setMapCenter({lat, lng});
                setLastestPlace(location.formatted_address);
                setSearchedPlaces((prev: SearchedPlaces[]) => {
                    const index = prev.findIndex((item) => item.name === location.formatted_address);
                    if (index !== -1) {
                        prev.splice(index, 1);
                    }
                    return [{
                        key: uuidv4(),
                        position: {lat, lng},
                        name: location.formatted_address
                    }, ...prev];
                });
            }
        } else {
            message.warning('Location cannot be empty !');
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (e.target.value === '') {
            setLocation(null);
        }
    }

    const handleOnLoad = (autocomplete: any) => {
        setAutoComplete(autocomplete);
    }

    const handlePlaceSelected = () => {
        if (autoComplete !== null) {
            const location = (autoComplete as any).getPlace();
            if (location.formatted_address) {
                setValue(location.formatted_address);
                setLocation(location);
                (search?.current as any).focus();
            }
        }
    }

    return (
        <div>
            <LoadScript
                googleMapsApiKey="AIzaSyCKR_7S6WE5ETziYlastsHnmKuvELeFTW4"
                libraries={libraries}
            >
                <Autocomplete onLoad={handleOnLoad} onPlaceChanged={handlePlaceSelected}>
                    <Search
                        ref={search}
                        placeholder="input search text"
                        enterButton="Search"
                        size="large"
                        value={value}
                        onSearch={onSearch}
                        onChange={handleInputChange}
                    />
                </Autocomplete>
            </LoadScript>
        </div>
    );
};

export default PlaceInput;