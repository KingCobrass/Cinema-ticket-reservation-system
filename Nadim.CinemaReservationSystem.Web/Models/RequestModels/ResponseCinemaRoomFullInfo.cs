﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Nadim.CinemaReservationSystem.Web.Models
{
    public class ResponseCinemaRoomFullInfo
    {
        public string Name { get; set; }

        public IEnumerable<SeatInfo> Seats { get; set; }
    }
}
