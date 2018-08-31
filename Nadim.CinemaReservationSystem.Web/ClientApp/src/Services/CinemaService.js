import CinemaDataAccess from '../DataAccess/CinemaDataAccess';
import ValidationService from './ValidationService';

export default class CinemaService{

    static getCinemaList = () =>{
        return CinemaDataAccess.getCinemaList();
    }

    static getCinema = (id) =>{
        return CinemaDataAccess.getCinema(id);
    }

    static createCinema = (cinemaInfo) =>{
        return CinemaDataAccess.createCinema(cinemaInfo);
    }

    static editCinema = (cinemaInfo) =>{
        return CinemaDataAccess.editCinema(cinemaInfo);
    }

    static getCinemaRoom = (cinemaId, cinemaRoomId) =>{
        return CinemaDataAccess.getCinemaRoom(cinemaId, cinemaRoomId);
    }

    static createCinemaRoom = (cinemaId, cinemaRoomInfo) =>{
        return CinemaDataAccess.createCinemaRoom(cinemaId, cinemaRoomInfo);
    }

    static editCinemaRoom = (cinemaId, cinemaRoomId, cinemaRoomInfo) =>{
        return CinemaDataAccess.editCinemaRoom(cinemaId, cinemaRoomId, cinemaRoomInfo);
    }

    static getCinemaRoomList = (cinemaId) =>{
        return CinemaDataAccess.getCinemaRoomList(cinemaId);
    }

    static getCinemaRoomSeatTypes = (cinemaId, cinemaRoomId) =>{
        return CinemaDataAccess.getCinemaRoomSeatTypes(cinemaId, cinemaRoomId);
    }

    static createSeatsArray(rows, columns){
        let seatsArray = [];
        for (let i = 0; i < rows; i++){
            seatsArray[i] = [];
            for (let j = 0; j < columns; j++) {
                seatsArray[i].push({
                    row: i,
                    column: j,
                    type:'default'
                });
            }
        }
        return seatsArray;
    }

    static validateCinemaRoomInfo(displayedComponents, rows, columns, name){
        if (displayedComponents.rows && !ValidationService.validateIntNumber(rows)){
            return false;
        }
        if (displayedComponents.columns && !ValidationService.validateIntNumber(columns)){
            return false;
        }
        if (displayedComponents.name && !ValidationService.validateString(name)){
            return false;
        }
        return true;
    }

    static validateCinemaInfo(displayedComponents, city, name){
        if (displayedComponents.city && !ValidationService.validateString(city)){
            return false;
        }
        if (displayedComponents.name && !ValidationService.validateString(name)){
            return false;
        }
        return true;
    }

    static updateCinemaList = (cinemaList, changedCinemaInfo) =>{
        const tempCinemaList = cinemaList;
        const tempChosenCinema = tempCinemaList.find((el) => el.cinemaId === changedCinemaInfo.cinemaId);
        tempChosenCinema.name = changedCinemaInfo.name;
        tempChosenCinema.city = changedCinemaInfo.city;
        return tempCinemaList;
    }

    static updateCinemaRoomList = (cinemaRoomList, changedCinemaRoomId, changedCinemaRoomInfo) =>{
        const tempCinemaRooms = cinemaRoomList;
        tempCinemaRooms.find((el) => el.cinemaRoomId === changedCinemaRoomId).name = changedCinemaRoomInfo.name;
        return tempCinemaRooms;
    }
}