
  export function drawCross(ctx, p, l = 4, color = "green", lineW = 1) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0 + l, 0);

    ctx.moveTo(0, 0);
    ctx.lineTo(0, 0 + l);

    ctx.moveTo(0, 0);
    ctx.lineTo(0 - l, 0);

    ctx.moveTo(0, 0);
    ctx.lineTo(0, 0 - l);

    ctx.lineWidth = lineW;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.restore();
  }

  export function toDegrees(radians)
  {
    var pi = Math.PI;
    return radians * (180/pi);
  }

  export function toRadians(degrees)
  {
    var pi = Math.PI;
    return degrees * (pi/180);
  }

  
  export function   rosQuaternionToGlobalTheta(orientation) {
    // See https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles#Rotation_matrices
    // here we use [x y z] = R * [1 0 0]
    var q0 = orientation.w;
    var q1 = orientation.x;
    var q2 = orientation.y;
    var q3 = orientation.z;

    return -Math.atan2(2 * (q0 * q3 + q1 * q2), 1 - 2 * (q2 * q2 + q3 * q3)); //  * 180.0 / Math.PI;// Canvas rotation is clock wise and in degrees
  }

  // int RawData;
  // float SmoothData;
  // float LPF_Beta = 0.025; // 0<ß<1
  // // LPF: Y(n) = (1-ß)*Y(n-1) + (ß*X(n))) = Y(n-1) - (ß*(Y(n-1)-X(n)));
  export class low_pass_filter{
    constructor(options) {
      options = options || {};

      this.SmoothData = options.StartData || 0 ;
      this.LPF_Beta = options.Beta || 0.025;
     
    }

  filter(RawData){
    this.SmoothData = this.SmoothData - (this.LPF_Beta * (this.SmoothData - RawData));
    return this.SmoothData;
  }

  }