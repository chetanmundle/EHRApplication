using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Appointment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AppointmentId { get; set; }
        [ForeignKey("User")]
        public int? PatientId { get; set; }
        public int? ProviderId { get; set; }
        public DateTime? AppointmentDate { get; set; }
        public TimeSpan? AppointmentTime { get; set; }
        public string AppointmentStatus { get; set; }
        public string ChiefComplaint { get; set; }
        public float? Fee { get; set; }
        public User User { get; set; }

    }
}
