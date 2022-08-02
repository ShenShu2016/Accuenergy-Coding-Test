/*
 * @Author: Leo
 * @Date: 2022-08-01 17:23:33
 * @LastEditors: Leo
 * @LastEditTime: 2022-08-02 17:48:04
 * @FilePath: \Accuenergy-Coding-Test\src\views\Home\Home.tsx
 * @Description:
 */
import React, { useEffect, useState } from 'react';
import PlaceInput from '../../components/Input/PlaceInput';
import Map from '../../components/GoogleMap/Map';
import { Button } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import PlaceTable from '../../components/PlaceTable/PlaceTable';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './Home.css';

export interface Center {
    lat: number;
    lng: number;
}

export interface SearchedPlaces {
    key: string;
    position: Center;
    name: string;
}

const Home: React.FC = () => {

    const [lastestPlace, setLastestPlace] = useState<string>('Your location');
    const [timeZone, setTimeZone] = useState<string>('');
    const [localTime, setLocalTime] = useState<string>('');
    const [searchedPlaces, setSearchedPlaces] = useState<Array<SearchedPlaces>>([]);
    const [mapCenter, setMapCenter] = useState<Center>({
        lat: 42.307,
        lng: -83.068,
    });

    useEffect(() => {
        axios.get(`https://api.timezonedb.com/v2.1/get-time-zone?key=4J0W2IR0ZDA2&format=json&by=position&lat=${mapCenter.lat}&lng=${mapCenter.lng}`)
            .then((res: any) => {
                setTimeZone(res.data.zoneName);
                setLocalTime(res.data.formatted);
            });
    }, [mapCenter]);

    const handleFindUserPos = () => {
        navigator.geolocation.getCurrentPosition((pos) => {
            setMapCenter({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
            });
            setSearchedPlaces((prev: SearchedPlaces[]) => {
                const index = prev.findIndex((item) => item.name === 'Your current location');
                if (index !== -1) {
                    prev.splice(index, 1);
                }
                return [{
                    key: uuidv4(),
                    position: {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    },
                    name: 'Your current location'
                }, ...prev];
            });
        });
    }

    return (
        <div className='home-container'>
            <div className='home-main'>

                <div className='left-container'>
                    <div className='place-input'>
                        <PlaceInput
                            setMapCenter={setMapCenter}
                            setLastestPlace={setLastestPlace}
                            setSearchedPlaces={setSearchedPlaces}
                        />
                    </div>

                    <div className='locate-container'>
                        <Button
                            type="primary"
                            shape="round"
                            icon={<EnvironmentOutlined />}
                            size='large'
                            style={{
                                width: '50%'
                            }}
                            onClick={handleFindUserPos}
                        >
                            Locate me !
                        </Button>
                    </div>

                    <div className='map-container'>
                        <Map center={mapCenter} onMapLoad={handleFindUserPos} searchedPlaces={searchedPlaces}/>
                    </div>
                </div>

                <div className='right-container'>
                    <div className='information-name'>
                        Lastest searched place:
                        <p>{lastestPlace}</p>
                    </div>

                    <div className='information-name'>
                        Time zone:
                        <p>{timeZone}</p>
                    </div>

                    <div className='information-name'>
                        Local time:
                        <p>{localTime}</p>
                    </div>

                    <div className='table-container'>
                        <PlaceTable
                            searchedPlaces={searchedPlaces}
                            setMapCenter={setMapCenter}
                            setSearchedPlaces={setSearchedPlaces}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;