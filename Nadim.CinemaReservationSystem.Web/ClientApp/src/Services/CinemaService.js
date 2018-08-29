import CinemaDataAccess from '../DataAccess/CinemaDataAccess'
import ApplicationService from './ApplicationService';

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
        if (displayedComponents.rows && !ApplicationService.validateIntNumber(rows)){
            return false;
        }
        if (displayedComponents.columns && !ApplicationService.validateIntNumber(columns)){
            return false;
        }
        if (displayedComponents.name && !name){
            return false;
        }
        return true;
    }
}