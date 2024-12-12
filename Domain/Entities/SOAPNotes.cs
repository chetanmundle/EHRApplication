using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class SOAPNotes
    {
        public int SOAPNotesId { get; set; }
        [ForeignKey("Appointment")]
        public int? AppointmentId { get; set; }
        public string Subjective { get; set; }
        public string Objective { get; set; }
        public string Assessment { get; set; }
        public string Plan { get; set; }
        public Appointment Appointment { get; set; }

    }
}
