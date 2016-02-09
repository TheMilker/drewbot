function Angle(value, isDegrees) {
   if (isDegrees) {
      this.degrees = value;
      this.radians = deg2Rad(value);
   } else {
      this.radians = value;
      this.degrees = rad2Deg(value);
   }
}

function deg2Rad(angle) {
   return angle * (Math.PI / 180.0);
}

function rad2Deg(angle) {
   return angle * (180.0 / Math.PI);
}