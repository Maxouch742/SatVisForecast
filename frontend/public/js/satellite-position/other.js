/*
 * satellite-js v1.1
 * (c) 2013 Shashwat Kandadai and UCSC
 * https://github.com/shashwatak/satellite-js
 * License: MIT
 */


import {
    DEG2RAD,
    TUMIN,
    XPDOTP,
    OPSMODE,
    MINUTES_PER_DAY,
    EARTH_RADIUS_KM,
    XKE,
    J2,
    J4,
    J3OJ2,
} from './constants.js'

export function dsinit(dsinit_parameters) {
    /*-----------------------------------------------------------------------------
     *
     *                           procedure dsinit
     *
     *  this procedure provides deep space contributions to mean motion dot due
     *    to geopotential resonance with half day and one day orbits.
     *
     *  author        : david vallado                  719-573-2600   28 jun 2005
     *
     *  inputs        :
     *    cosim, sinim-
     *    emsq        - eccentricity squared
     *    argpo       - argument of perigee
     *    s1, s2, s3, s4, s5      -
     *    ss1, ss2, ss3, ss4, ss5 -
     *    sz1, sz3, sz11, sz13, sz21, sz23, sz31, sz33 -
     *    t           - time
     *    tc          -
     *    gsto        - greenwich sidereal time                   rad
     *    mo          - mean anomaly
     *    mdot        - mean anomaly dot (rate)
     *    no          - mean motion
     *    nodeo       - right ascension of ascending node
     *    nodedot     - right ascension of ascending node dot (rate)
     *    xpidot      -
     *    z1, z3, z11, z13, z21, z23, z31, z33 -
     *    eccm        - eccentricity
     *    argpm       - argument of perigee
     *    inclm       - inclination
     *    mm          - mean anomaly
     *    xn          - mean motion
     *    nodem       - right ascension of ascending node
     *
     *  outputs       :
     *    em          - eccentricity
     *    argpm       - argument of perigee
     *    inclm       - inclination
     *    mm          - mean anomaly
     *    nm          - mean motion
     *    nodem       - right ascension of ascending node
     *    irez        - flag for resonance           0-none, 1-one day, 2-half day
     *    atime       -
     *    d2201, d2211, d3210, d3222, d4410, d4422, d5220, d5232, d5421, d5433    -
     *    dedt        -
     *    didt        -
     *    dmdt        -
     *    dndt        -
     *    dnodt       -
     *    domdt       -
     *    del1, del2, del3        -
     *    ses  , sghl , sghs , sgs  , shl  , shs  , sis  , sls
     *    theta       -
     *    xfact       -
     *    xlamo       -
     *    xli         -
     *    xni
     *
     *  locals        :
     *    ainv2       -
     *    aonv        -
     *    cosisq      -
     *    eoc         -
     *    f220, f221, f311, f321, f322, f330, f441, f442, f522, f523, f542, f543  -
     *    g200, g201, g211, g300, g310, g322, g410, g422, g520, g521, g532, g533  -
     *    sini2       -
     *    temp        -
     *    temp1       -
     *    theta       -
     *    xno2        -
     *
     *  coupling      :
     *    getgravconst
     *
     *  references    :
     *    hoots, roehrich, norad spacetrack report #3 1980
     *    hoots, norad spacetrack report #6 1986
     *    hoots, schumacher and glover 2004
     *    vallado, crawford, hujsak, kelso  2006
       ----------------------------------------------------------------------------*/
     'use strict';
     var cosim   = dsinit_parameters.cosim,
         emsq    = dsinit_parameters.emsq,
         argpo   = dsinit_parameters.argpo,
 
         s1      = dsinit_parameters.s1,
         s2      = dsinit_parameters.s2,
         s3      = dsinit_parameters.s3,
         s4      = dsinit_parameters.s4,
         s5      = dsinit_parameters.s5,
         sinim   = dsinit_parameters.sinim,
 
         ss1     = dsinit_parameters.ss1,
         ss2     = dsinit_parameters.ss2,
         ss3     = dsinit_parameters.ss3,
         ss4     = dsinit_parameters.ss4,
         ss5     = dsinit_parameters.ss5,
 
         sz1     = dsinit_parameters.sz1,
         sz3     = dsinit_parameters.sz3,
         sz11    = dsinit_parameters.sz11,
         sz13    = dsinit_parameters.sz13,
         sz21    = dsinit_parameters.sz21,
         sz23    = dsinit_parameters.sz23,
         sz31    = dsinit_parameters.sz31,
         sz33    = dsinit_parameters.sz33,
 
         t       = dsinit_parameters.t,
         tc      = dsinit_parameters.tc,
         gsto    = dsinit_parameters.gsto,
 
         mo      = dsinit_parameters.mo,
         mdot    = dsinit_parameters.mdot,
         no      = dsinit_parameters.no,
         nodeo   = dsinit_parameters.nodeo,
         nodedot = dsinit_parameters.nodedot,
 
         xpidot  = dsinit_parameters.xpidot,
 
         z1      = dsinit_parameters.z1,
         z3      = dsinit_parameters.z3,
         z11     = dsinit_parameters.z11,
         z13     = dsinit_parameters.z13,
         z21     = dsinit_parameters.z21,
         z23     = dsinit_parameters.z23,
         z31     = dsinit_parameters.z31,
         z33     = dsinit_parameters.z33,
 
         ecco    = dsinit_parameters.ecco,
         eccsq   = dsinit_parameters.eccsq,
         em      = dsinit_parameters.em,
 
         argpm   = dsinit_parameters.argpm,
         inclm   = dsinit_parameters.inclm,
         mm      = dsinit_parameters.mm,
         nm      = dsinit_parameters.nm,
         nodem   = dsinit_parameters.nodem,
         irez    = dsinit_parameters.irez,
         atime   = dsinit_parameters.atime,
 
         d2201   = dsinit_parameters.d2201,
         d2211   = dsinit_parameters.d2211,
         d3210   = dsinit_parameters.d3210,
         d3222   = dsinit_parameters.d3222,
         d4410   = dsinit_parameters.d4410,
         d4422   = dsinit_parameters.d4422,
 
         d5220   = dsinit_parameters.d5220,
         d5232   = dsinit_parameters.d5232,
         d5421   = dsinit_parameters.d5421,
         d5433   = dsinit_parameters.d5433,
 
         dedt    = dsinit_parameters.dedt,
         didt    = dsinit_parameters.didt,
         dmdt    = dsinit_parameters.dmdt,
         dnodt   = dsinit_parameters.dnodt,
         domdt   = dsinit_parameters.domdt,
 
         del1    = dsinit_parameters.del1,
         del2    = dsinit_parameters.del2,
         del3    = dsinit_parameters.del3,
 
         xfact   = dsinit_parameters.xfact,
         xlamo   = dsinit_parameters.xlamo,
         xli     = dsinit_parameters.xli,
         xni     = dsinit_parameters.xni;
 
     var f220, f221, f311, f321, f322, f330, f441, f442, f522, f523, f542, f543;
     var g200, g201, g211, g300, g310, g322, g410, g422, g520, g521, g532, g533;
     var sini2,  temp,   temp1,    theta,    xno2,
         ainv2,  aonv,   cosisq, eoc;
 
     var q22     = 1.7891679e-6;
     var q31     = 2.1460748e-6;
     var q33     = 2.2123015e-7;
     var root22  = 1.7891679e-6;
     var root44  = 7.3636953e-9;
     var root54  = 2.1765803e-9;
     var rptim   = 4.37526908801129966e-3; // equates to 7.29211514668855e-5 rad/sec
     var root32  = 3.7393792e-7;
     var root52  = 1.1428639e-7;
     var x2o3    = 2.0 / 3.0;
     var znl     = 1.5835218e-4;
     var zns     = 1.19459e-5;
 
 
     //  -------------------- deep space initialization ------------
     irez    = 0;
     if (0.0034906585 < nm < 0.0052359877){
         irez = 1;
     }
     if (8.26e-3 <= nm <= 9.24e-3 && em >= 0.5){
         irez = 2;
     }
 
     //  ------------------------ do solar terms -------------------
     var ses =  ss1 * zns *  ss5;
     var sis =  ss2 * zns * (sz11 + sz13);
     var sls = -zns * ss3 * (sz1  + sz3  - 14.0 - 6.0 * emsq);
     var sghs=  ss4 * zns * (sz31 + sz33 -  6.0);
     var shs = -zns * ss2 * (sz21 + sz23);
 
     //  sgp4fix for 180 deg incl
     if (inclm < 5.2359877e-2 || inclm > Math.PI - 5.2359877e-2){
         shs = 0.0;
     }
     if (sinim !== 0.0){
         shs = shs / sinim;
     }
     var sgs  = sghs - cosim * shs;
 
     //  ------------------------- do lunar terms ------------------
     dedt =  ses + s1  *  znl *  s5;
     didt =  sis + s2  *  znl * (z11 + z13);
     dmdt =  sls - znl *  s3  * (z1  + z3 - 14.0 - 6.0 * emsq);
     var sghl =  s4  * znl * (z31 +  z33 - 6.0);
     var shll = -znl * s2  * (z21 +  z23);
     //  sgp4fix for 180 deg incl
     if ((inclm < 5.2359877e-2) || (inclm > (Math.PI - 5.2359877e-2))){
         shll = 0.0;
     }
     domdt = sgs + sghl;
     dnodt = shs;
     if (sinim !== 0.0){
          domdt = domdt - cosim / sinim * shll;
          dnodt = dnodt + shll / sinim;
     }
 
 
     //  ----------- calculate deep space resonance effects --------
     var dndt    = 0.0;
     theta   = (gsto + tc * rptim) % (2*Math.PI);
     em          = em + dedt * t;
     inclm       = inclm + didt * t;
     argpm       = argpm + domdt * t;
     nodem       = nodem + dnodt * t;
     mm          = mm + dmdt * t;
 
     //   sgp4fix for negative inclinations
     //   the following if statement should be commented out
     //if (inclm < 0.0)
     //  {
     //    inclm  = -inclm;
     //    argpm  = argpm - pi;
     //    nodem = nodem + pi;
     //  }
 
 
     //  -------------- initialize the resonance terms -------------
     if (irez !== 0) {
         aonv = Math.pow(nm / xke, x2o3);
         //  ---------- geopotential resonance for 12 hour orbits ------
         if (irez === 2) {
             cosisq = cosim * cosim;
             var emo= em;
             em     = ecco;
             var emsqo  = emsq;
             emsq   = eccsq;
             eoc    = em * emsq;
             g201   = -0.306 - (em - 0.64) * 0.440;
 
             if (em <= 0.65){
                 g211 =    3.616  -  13.2470 * em +  16.2900 * emsq;
                 g310 =  -19.302  + 117.3900 * em - 228.4190 * emsq +  156.5910 * eoc;
                 g322 =  -18.9068 + 109.7927 * em - 214.6334 * emsq +  146.5816 * eoc;
                 g410 =  -41.122  + 242.6940 * em - 471.0940 * emsq +  313.9530 * eoc;
                 g422 = -146.407  + 841.8800 * em - 1629.014 * emsq + 1083.4350 * eoc;
                 g520 = -532.114  + 3017.977 * em - 5740.032 * emsq + 3708.2760 * eoc;
             }
             else {
                 g211 =   -72.099 +   331.819 * em -   508.738 * emsq +   266.724 * eoc;
                 g310 =  -346.844 +  1582.851 * em -  2415.925 * emsq +  1246.113 * eoc;
                 g322 =  -342.585 +  1554.908 * em -  2366.899 * emsq +  1215.972 * eoc;
                 g410 = -1052.797 +  4758.686 * em -  7193.992 * emsq +  3651.957 * eoc;
                 g422 = -3581.690 + 16178.110 * em - 24462.770 * emsq + 12422.520 * eoc;
                 if (em > 0.715) {
                     g520 =-5149.66 + 29936.92 * em - 54087.36 * emsq + 31324.56 * eoc;
                 }
                 else {
                     g520 = 1464.74 -  4664.75 * em +  3763.64 * emsq;
                 }
             }
             if (em < 0.7) {
                 g533 = -919.22770 + 4988.6100 * em - 9064.7700 * emsq + 5542.21  * eoc;
                 g521 = -822.71072 + 4568.6173 * em - 8491.4146 * emsq + 5337.524 * eoc;
                 g532 = -853.66600 + 4690.2500 * em - 8624.7700 * emsq + 5341.4  * eoc;
             }
             else{
                 g533 =-37995.780 + 161616.52 * em - 229838.20 * emsq + 109377.94 * eoc;
                 g521 =-51752.104 + 218913.95 * em - 309468.16 * emsq + 146349.42 * eoc;
                 g532 =-40023.880 + 170470.89 * em - 242699.48 * emsq + 115605.82 * eoc;
             }
             sini2 =  sinim * sinim;
             f220  =  0.75 * (1.0 + 2.0 * cosim+cosisq);
             f221  =  1.5 * sini2;
             f321  =  1.875 * sinim  *  (1.0 - 2.0 * cosim - 3.0 * cosisq);
             f322  = -1.875 * sinim  *  (1.0 + 2.0 * cosim - 3.0 * cosisq);
             f441  = 35.0 * sini2 * f220;
             f442  = 39.3750 * sini2 * sini2;
             f522  =  9.84375 * sinim * (sini2 * (1.0 - 2.0 * cosim- 5.0 * cosisq) +
                      0.33333333 * (-2.0 + 4.0 * cosim + 6.0 * cosisq) );
             f523  = sinim * (4.92187512 * sini2 * (-2.0 - 4.0 * cosim +
                     10.0 * cosisq) + 6.56250012 * (1.0+2.0 * cosim - 3.0 * cosisq));
             f542  = 29.53125 * sinim * (2.0 - 8.0 * cosim + cosisq *
                    (-12.0    + 8.0   *  cosim + 10.0 * cosisq));
             f543  = 29.53125 * sinim * (-2.0 - 8.0   * cosim+cosisq *
                    ( 12.0    + 8.0   * cosim - 10.0  * cosisq));
 
             xno2  =  nm     * nm;
             ainv2 =  aonv   * aonv;
             temp1 =  3.0    * xno2  * ainv2;
             temp  =  temp1  * root22;
             d2201 =  temp   * f220  * g201;
             d2211 =  temp   * f221  * g211;
             temp1 =  temp1  * aonv;
             temp  =  temp1  * root32;
             d3210 =  temp   * f321  * g310;
             d3222 =  temp   * f322  * g322;
             temp1 =  temp1  * aonv;
             temp  =  2.0    * temp1 * root44;
             d4410 =  temp   * f441  * g410;
             d4422 =  temp   * f442  * g422;
             temp1 =  temp1  * aonv;
             temp  =  temp1  * root52;
             d5220 =  temp   * f522  * g520;
             d5232 =  temp   * f523  * g532;
             temp  =  2.0    * temp1 * root54;
             d5421 =  temp   * f542  * g521;
             d5433 =  temp   * f543  * g533;
             xlamo = (mo     + nodeo + nodeo -  theta    - theta) % twopi;
             xfact =  mdot   + dmdt  + 2.0   * (nodedot  + dnodt  - rptim) - no;
             em    =  emo;
             emsq  =  emsqo;
         }
         //  ---------------- synchronous resonance terms --------------
         if (irez === 1) {
             g200  = 1.0 + emsq * (-2.5 + 0.8125 * emsq);
             g310  = 1.0 + 2.0 * emsq;
             g300  = 1.0 + emsq * (-6.0 + 6.60937 * emsq);
             f220  = 0.75 * (1.0 + cosim) * (1.0 + cosim);
             f311  = 0.9375 * sinim * sinim * (1.0 + 3.0 * cosim) - 0.75 * (1.0 + cosim);
             f330  = 1.0 + cosim;
             f330  = 1.875 * f330 * f330 * f330;
             del1  = 3.0 * nm * nm * aonv * aonv;
             del2  = 2.0 * del1 * f220 * g200 * q22;
             del3  = 3.0 * del1 * f330 * g300 * q33 * aonv;
             del1  = del1 * f311 * g310 * q31 * aonv;
             xlamo = (mo + nodeo + argpo - theta) % twopi;
             xfact = mdot + xpidot - rptim + dmdt + domdt + dnodt - no;
         }
         //  ------------ for sgp4, initialize the integrator ----------
         xli   = xlamo;
         xni   = no;
         atime = 0.0;
         nm    = no + dndt;
     }
     var dsinit_results = {
         em : em,
         argpm : argpm,
         inclm : inclm,
         mm : mm,
         nm : nm,
         nodem : nodem,
 
         irez : irez,
         atime : atime,
 
         d2201 : d2201,
         d2211 : d2211,
         d3210 : d3210,
         d3222 : d3222,
         d4410 : d4410,
 
         d4422 : d4422,
         d5220 : d5220,
         d5232 : d5232,
         d5421 : d5421,
         d5433 : d5433,
 
         dedt : dedt,
         didt : didt,
         dmdt : dmdt,
         dndt : dndt,
         dnodt : dnodt,
         domdt : domdt,
 
         del1 : del1,
         del2 : del2,
         del3 : del3,
 
         xfact : xfact,
         xlamo : xlamo,
         xli : xli,
         xni : xni
     };
     return dsinit_results;
 }
 
export function dpper (satrec, dpper_parameters) {
    /* -----------------------------------------------------------------------------
    *
    *                           procedure dpper
    *
    *  this procedure provides deep space long period periodic contributions
    *    to the mean elements.  by design, these periodics are zero at epoch.
    *    this used to be dscom which included initialization, but it's really a
    *    recurring function.
    *
    *  author        : david vallado                  719-573-2600   28 jun 2005
    *
    *  inputs        :
    *    e3          -
    *    ee2         -
    *    peo         -
    *    pgho        -
    *    pho         -
    *    pinco       -
    *    plo         -
    *    se2 , se3 , sgh2, sgh3, sgh4, sh2, sh3, si2, si3, sl2, sl3, sl4 -
    *    t           -
    *    xh2, xh3, xi2, xi3, xl2, xl3, xl4 -
    *    zmol        -
    *    zmos        -
    *    ep          - eccentricity                           0.0 - 1.0
    *    inclo       - inclination - needed for lyddane modification
    *    nodep       - right ascension of ascending node
    *    argpp       - argument of perigee
    *    mp          - mean anomaly
    *
    *  outputs       :
    *    ep          - eccentricity                           0.0 - 1.0
    *    inclp       - inclination
    *    nodep        - right ascension of ascending node
    *    argpp       - argument of perigee
    *    mp          - mean anomaly
    *
    *  locals        :
    *    alfdp       -
    *    betdp       -
    *    cosip  , sinip  , cosop  , sinop  ,
    *    dalf        -
    *    dbet        -
    *    dls         -
    *    f2, f3      -
    *    pe          -
    *    pgh         -
    *    ph          -
    *    pinc        -
    *    pl          -
    *    sel   , ses   , sghl  , sghs  , shl   , shs   , sil   , sinzf , sis   ,
    *    sll   , sls
    *    xls         -
    *    xnoh        -
    *    zf          -
    *    zm          -
    *
    *  coupling      :
    *    none.
    *
    *  references    :
    *    hoots, roehrich, norad spacetrack report #3 1980
    *    hoots, norad spacetrack report #6 1986
    *    hoots, schumacher and glover 2004
    *    vallado, crawford, hujsak, kelso  2006
      ----------------------------------------------------------------------------*/

    'use strict';

    var inclo   = dpper_parameters.inclo,
        init    = dpper_parameters.init,
        ep      = dpper_parameters.ep,
        inclp   = dpper_parameters.inclp,
        nodep   = dpper_parameters.nodep,
        argpp   = dpper_parameters.argpp,
        mp      = dpper_parameters.mp,
        opsmode = dpper_parameters.opsmode;


    // Copy satellite attributes into local variables for convenience
    // and symmetry in writing formulae.

    var alfdp, betdp,
        cosip, sinip  , cosop  , sinop,
        dalf,   dbet,   dls,
        f2, f3,
        pe, pgh, ph, pinc, pl,
        sel, ses, sghl, sghs, shl, shs, sil, sinzf, sis,  sll, sls,
        xls,    xnoh,   zf, zm, shll;

    var e3      = satrec.e3;
    var ee2     = satrec.ee2;
    var peo     = satrec.peo;
    var pgho    = satrec.pgho;
    var pho     = satrec.pho;
    var pinco   = satrec.pinco;
    var plo     = satrec.plo;
    var se2     = satrec.se2;
    var se3     = satrec.se3;
    var sgh2    = satrec.sgh2;
    var sgh3    = satrec.sgh3;
    var sgh4    = satrec.sgh4;
    var sh2     = satrec.sh2;
    var sh3     = satrec.sh3;
    var si2     = satrec.si2;
    var si3     = satrec.si3;
    var sl2     = satrec.sl2;
    var sl3     = satrec.sl3;
    var sl4     = satrec.sl4;
    var t       = satrec.t;
    var xgh2    = satrec.xgh2;
    var xgh3    = satrec.xgh3;
    var xgh4    = satrec.xgh4;
    var xh2     = satrec.xh2;
    var xh3     = satrec.xh3;
    var xi2     = satrec.xi2;
    var xi3     = satrec.xi3;
    var xl2     = satrec.xl2;
    var xl3     = satrec.xl3;
    var xl4     = satrec.xl4;
    var zmol    = satrec.zmol;
    var zmos    = satrec.zmos;

    //  ---------------------- constants -----------------------------
    var zns     = 1.19459e-5;
    var zes     = 0.01675;
    var znl     = 1.5835218e-4;
    var zel     = 0.05490;

    //  --------------- calculate time varying periodics -----------
    zm      = zmos + zns * t;
    // be sure that the initial call has time set to zero
    if (init === 'y') {
        zm      = zmos;
    }
    zf      = zm    + 2.0   * zes   * Math.sin(zm);
    sinzf   = Math.sin(zf);
    f2      =  0.5  * sinzf * sinzf - 0.25;
    f3      = -0.5  * sinzf * Math.cos(zf);
    ses     = se2   * f2    + se3   * f3;
    sis     = si2   * f2    + si3   * f3;
    sls     = sl2   * f2    + sl3   * f3    + sl4   * sinzf;
    sghs    = sgh2  * f2    + sgh3  * f3    + sgh4  * sinzf;
    shs     = sh2   * f2    + sh3   * f3;
    zm          = zmol  + znl   * t;
    if (init === 'y') {
        zm      = zmol;
    }

    zf          = zm    + 2.0   * zel   * Math.sin(zm);
    sinzf       = Math.sin(zf);
    f2          =  0.5  * sinzf * sinzf - 0.25;
    f3          = -0.5  * sinzf * Math.cos(zf);
    sel     = ee2   * f2    + e3    * f3;
    sil     = xi2   * f2    + xi3   * f3;
    sll     = xl2   * f2    + xl3   * f3    + xl4 * sinzf;
    sghl    = xgh2  * f2    + xgh3  * f3    + xgh4 * sinzf;
    shll    = xh2   * f2    + xh3   * f3;
    pe      = ses   + sel;
    pinc    = sis   + sil;
    pl      = sls   + sll;
    pgh     = sghs  + sghl;
    ph      = shs   + shll;

    if (init === 'n'){
        pe      = pe    - peo;
        pinc    = pinc  - pinco;
        pl      = pl    - plo;
        pgh     = pgh   - pgho;
        ph      = ph    - pho;
        inclp   = inclp + pinc;
        ep      = ep    + pe;
        sinip = Math.sin(inclp);
        cosip = Math.cos(inclp);

        /* ----------------- apply periodics directly ------------ */
        //  sgp4fix for lyddane choice
        //  strn3 used original inclination - this is technically feasible
        //  gsfc used perturbed inclination - also technically feasible
        //  probably best to readjust the 0.2 limit value and limit discontinuity
        //  0.2 rad = 11.45916 deg
        //  use next line for original strn3 approach and original inclination
        //  if (inclo >= 0.2)
        //  use next line for gsfc version and perturbed inclination
        if (inclp >= 0.2) {
            ph      = ph    / sinip;
            pgh     = pgh   - cosip     * ph;
            argpp   = argpp + pgh;
            nodep   = nodep + ph;
            mp      = mp    + pl;
        }
        else {
            //  ---- apply periodics with lyddane modification ----
            sinop   = Math.sin(nodep);
            cosop   = Math.cos(nodep);
            alfdp   = sinip * sinop;
            betdp   = sinip * cosop;
            dalf    =  ph   * cosop + pinc * cosip * sinop;
            dbet    = -ph   * sinop + pinc * cosip * cosop;
            alfdp       = alfdp + dalf;
            betdp       = betdp + dbet;
            nodep       = nodep % twopi;
            //  sgp4fix for afspc written intrinsic functions
            //  nodep used without a trigonometric function ahead
            if (nodep < 0.0 && opsmode === 'a') {
                nodep   = nodep + twopi;
            }
            xls     = mp    + argpp + cosip * nodep;
            dls     = pl    + pgh   - pinc  * nodep * sinip;
            xls         = xls   + dls;
            xnoh    = nodep;
            nodep       = Math.atan2(alfdp, betdp);
            //  sgp4fix for afspc written intrinsic functions
            //  nodep used without a trigonometric function ahead
            if (nodep < 0.0 && opsmode === 'a'){
                nodep = nodep + twopi;
            }
            if (Math.abs(xnoh - nodep) > pi) {
                if (nodep < xnoh){
                     nodep = nodep + twopi;
                }
                else{
                     nodep = nodep - twopi;
                }
            }
            mp    = mp  + pl;
            argpp = xls - mp - cosip * nodep;
        }
    }
    var dpper_result = {
        ep : ep,
        inclp : inclp,
        nodep : nodep,
        argpp : argpp,
        mp : mp
    };
    return dpper_result;
}

export function dscom (dscom_parameters) {
    /*-----------------------------------------------------------------------------
    *
    *                           procedure dscom
    *
    *  this procedure provides deep space common items used by both the secular
    *    and periodics subroutines.  input is provided as shown. this routine
    *    used to be called dpper, but the functions inside weren't well organized.
    *
    *  author        : david vallado                  719-573-2600   28 jun 2005
    *
    *  inputs        :
    *    epoch       -
    *    ep          - eccentricity
    *    argpp       - argument of perigee
    *    tc          -
    *    inclp       - inclination
    *    nodep       - right ascension of ascending node
    *    np          - mean motion
    *
    *  outputs       :
    *    sinim  , cosim  , sinomm , cosomm , snodm  , cnodm
    *    day         -
    *    e3          -
    *    ee2         -
    *    em          - eccentricity
    *    emsq        - eccentricity squared
    *    gam         -
    *    peo         -
    *    pgho        -
    *    pho         -
    *    pinco       -
    *    plo         -
    *    rtemsq      -
    *    se2, se3         -
    *    sgh2, sgh3, sgh4        -
    *    sh2, sh3, si2, si3, sl2, sl3, sl4         -
    *    s1, s2, s3, s4, s5, s6, s7          -
    *    ss1, ss2, ss3, ss4, ss5, ss6, ss7, sz1, sz2, sz3         -
    *    sz11, sz12, sz13, sz21, sz22, sz23, sz31, sz32, sz33        -
    *    xgh2, xgh3, xgh4, xh2, xh3, xi2, xi3, xl2, xl3, xl4         -
    *    nm          - mean motion
    *    z1, z2, z3, z11, z12, z13, z21, z22, z23, z31, z32, z33         -
    *    zmol        -
    *    zmos        -
    *
    *  locals        :
    *    a1, a2, a3, a4, a5, a6, a7, a8, a9, a10         -
    *    betasq      -
    *    cc          -
    *    ctem, stem        -
    *    x1, x2, x3, x4, x5, x6, x7, x8          -
    *    xnodce      -
    *    xnoi        -
    *    zcosg  , zsing  , zcosgl , zsingl , zcosh  , zsinh  , zcoshl , zsinhl ,
    *    zcosi  , zsini  , zcosil , zsinil ,
    *    zx          -
    *    zy          -
    *
    *  coupling      :
    *    none.
    *
    *  references    :
    *    hoots, roehrich, norad spacetrack report #3 1980
    *    hoots, norad spacetrack report #6 1986
    *    hoots, schumacher and glover 2004
    *    vallado, crawford, hujsak, kelso  2006
      ----------------------------------------------------------------------------*/

    'use strict';

var epoch   = dscom_parameters.epoch,
    ep      = dscom_parameters.ep,
    argpp   = dscom_parameters.argpp,
    tc      = dscom_parameters.tc,
    inclp   = dscom_parameters.inclp,
    nodep   = dscom_parameters.nodep,
    np      = dscom_parameters.np,
    e3      = dscom_parameters.e3,
    ee2     = dscom_parameters.ee2,
    peo     = dscom_parameters.peo,
    pgho    = dscom_parameters.pgho,
    pho     = dscom_parameters.pho,
    pinco   = dscom_parameters.pinco,
    plo     = dscom_parameters.plo,
    se2     = dscom_parameters.se2,
    se3     = dscom_parameters.se3,
    sgh2    = dscom_parameters.sgh2,
    sgh3    = dscom_parameters.sgh3,
    sgh4    = dscom_parameters.sgh4,
    sh2     = dscom_parameters.sh2,
    sh3     = dscom_parameters.sh3,
    si2     = dscom_parameters.si2,
    si3     = dscom_parameters.si3,
    sl2     = dscom_parameters.sl2,
    sl3     = dscom_parameters.sl3,
    sl4     = dscom_parameters.sl4,
    xgh2    = dscom_parameters.xgh2,
    xgh3    = dscom_parameters.xgh3,
    xgh4    = dscom_parameters.xgh4,
    xh2     = dscom_parameters.xh2,
    xh3     = dscom_parameters.xh3,
    xi2     = dscom_parameters.xi2,
    xi3     = dscom_parameters.xi3,
    xl2     = dscom_parameters.xl2,
    xl3     = dscom_parameters.xl3,
    xl4     = dscom_parameters.xl4,
    zmol    = dscom_parameters.zmol,
    zmos    = dscom_parameters.zmos;


    var a1, a2, a3, a4, a5, a6, a7, a8, a9, a10,
        betasq, cc,  ctem, stem,
        x1, x2, x3, x4, x5, x6, x7, x8,
        xnodce, xnoi,
        zcosg, zsing, zcosgl, zsingl,
        zcosh, zsinh, zcoshl, zsinhl,
        zcosi, zsini, zcosil, zsinil,
        zx, zy;

    var ss1,  ss2,  ss3,  ss4,  ss5,  ss6,  ss7,
        sz1,  sz2,  sz3,
        sz11, sz12, sz13,
        sz21, sz22, sz23,
        sz31, sz32, sz33;
    var s1, s2, s3, s4, s5, s6, s7;
    var z1, z2, z3,
        z11,z12,z13,
        z21,z22,z23,
        z31,z32,z33;

    //  -------------------------- constants -------------------------
    var zes     =  0.01675;
    var zel     =  0.05490;
    var c1ss    =  2.9864797e-6;
    var c1l     =  4.7968065e-7;
    var zsinis  =  0.39785416;
    var zcosis  =  0.91744867;
    var zcosgs  =  0.1945905;
    var zsings  = -0.98088458;
    //  --------------------- local variables ------------------------
    var nm     = np;
    var em     = ep;
    var snodm  = Math.sin(nodep);
    var cnodm  = Math.cos(nodep);
    var sinomm = Math.sin(argpp);
    var cosomm = Math.cos(argpp);
    var sinim  = Math.sin(inclp);
    var cosim  = Math.cos(inclp);
    var emsq   = em * em;
    betasq = 1.0 - emsq;
    var rtemsq = Math.sqrt(betasq);

    //  ----------------- initialize lunar solar terms ---------------
    peo        = 0.0;
    pinco      = 0.0;
    plo        = 0.0;
    pgho       = 0.0;
    pho        = 0.0;
    var day    = epoch + 18261.5 + tc / 1440.0;
    xnodce = (4.5236020 - 9.2422029e-4 * day) % (2*Math.PI);
    stem   = Math.sin(xnodce);
    ctem   = Math.cos(xnodce);
    zcosil = 0.91375164 - 0.03568096 * ctem;
    zsinil = Math.sqrt(1.0 - zcosil * zcosil);
    zsinhl = 0.089683511 * stem / zsinil;
    zcoshl = Math.sqrt(1.0 - zsinhl * zsinhl);
    var gam    = 5.8351514 + 0.0019443680 * day;
    zx     = 0.39785416 * stem / zsinil;
    zy     = zcoshl * ctem + 0.91744867 * zsinhl * stem;
    zx         = Math.atan2(zx, zy);
    zx         = gam + zx - xnodce;
    zcosgl = Math.cos(zx);
    zsingl = Math.sin(zx);

    //  ------------------------- do solar terms ---------------------
    zcosg = zcosgs;
    zsing = zsings;
    zcosi = zcosis;
    zsini = zsinis;
    zcosh = cnodm;
    zsinh = snodm;
    cc    = c1ss;
    xnoi  = 1.0 / nm;

    var lsflg = 0;
    while (lsflg < 2) {
        lsflg += 1;
        a1     =   zcosg   * zcosh + zsing * zcosi * zsinh;
        a3     =  -zsing   * zcosh + zcosg * zcosi * zsinh;
        a7     =  -zcosg   * zsinh + zsing * zcosi * zcosh;
        a8     =   zsing   * zsini;
        a9     =   zsing   * zsinh + zcosg * zcosi * zcosh;
        a10    =   zcosg   * zsini;
        a2     =   cosim   * a7    + sinim * a8;
        a4     =   cosim   * a9    + sinim * a10;
        a5     =  -sinim   * a7    + cosim * a8;
        a6     =  -sinim   * a9    + cosim * a10;

        x1     =  a1   * cosomm    + a2    * sinomm;
        x2     =  a3   * cosomm    + a4    * sinomm;
        x3     = -a1   * sinomm    + a2    * cosomm;
        x4     = -a3   * sinomm    + a4    * cosomm;
        x5     =  a5   * sinomm;
        x6     =  a6   * sinomm;
        x7     =  a5   * cosomm;
        x8     =  a6   * cosomm;

        z31    = 12.0  *  x1 * x1 - 3.0 * x3 * x3;
        z32    = 24.0  *  x1 * x2 - 6.0 * x3 * x4;
        z33    = 12.0  *  x2 * x2 - 3.0 * x4 * x4;
        z1     =  3.0  * (a1 * a1 + a2 * a2) + z31 * emsq;
        z2     =  6.0  * (a1 * a3 + a2 * a4) + z32 * emsq;
        z3     =  3.0  * (a3 * a3 + a4 * a4) + z33 * emsq;
        z11    = -6.0  *  a1 * a5 + emsq *
               (-24.0  *  x1 * x7-6.0  * x3 * x5);
        z12    = -6.0  * (a1 * a6 + a3 * a5) + emsq *
               (-24.0  * (x2 * x7 + x1 * x8) +
                 -6.0  * (x3 * x6 + x4 * x5));
        z13    = -6.0  *  a3 * a6 + emsq *
               (-24.0  *  x2 * x8 - 6.0 * x4 * x6);
        z21    =  6.0  *  a2 * a5 + emsq *
               ( 24.0  *  x1 * x5 - 6.0 * x3 * x7);
        z22    =  6.0  * (a4 * a5 + a2 * a6) + emsq *
               ( 24.0  * (x2 * x5 + x1 * x6) -
                  6.0  * (x4 * x7 + x3 * x8));
        z23    =  6.0  *  a4 * a6 + emsq *
               ( 24.0  *  x2 * x6 - 6.0 * x4 * x8);
        z1         =   z1  + z1 + betasq * z31;
        z2         =   z2  + z2 + betasq * z32;
        z3         =   z3  + z3 + betasq * z33;
        s3     =   cc  * xnoi;
        s2     =  -0.5 * s3 / rtemsq;
        s4     =   s3  * rtemsq;
        s1     = -15.0 * em * s4;
        s5     =   x1  * x3 + x2 * x4;
        s6     =   x2  * x3 + x1 * x4;
        s7     =   x2  * x4 - x1 * x3;

        //  ----------------------- do lunar terms -------------------
        if (lsflg === 1) {
            ss1    = s1;
            ss2    = s2;
            ss3    = s3;
            ss4    = s4;
            ss5    = s5;
            ss6    = s6;
            ss7    = s7;
            sz1    = z1;
            sz2    = z2;
            sz3    = z3;
            sz11   = z11;
            sz12   = z12;
            sz13   = z13;
            sz21   = z21;
            sz22   = z22;
            sz23   = z23;
            sz31   = z31;
            sz32   = z32;
            sz33   = z33;
            zcosg      = zcosgl;
            zsing      = zsingl;
            zcosi      = zcosil;
            zsini      = zsinil;
            zcosh      = zcoshl * cnodm + zsinhl * snodm;
            zsinh      = snodm * zcoshl - cnodm * zsinhl;
            cc         = c1l;
        }
    }
    zmol = (4.7199672 + 0.22997150  * day - gam)   % (2*Math.PI);
    zmos = (6.2565837 + 0.017201977 * day)         % (2*Math.PI);

    //  ------------------------ do solar terms ----------------------
    se2  =   2.0 * ss1 * ss6;
    se3  =   2.0 * ss1 * ss7;
    si2  =   2.0 * ss2 * sz12;
    si3  =   2.0 * ss2 * (sz13 - sz11);
    sl2  =  -2.0 * ss3 * sz2;
    sl3  =  -2.0 * ss3 * (sz3 - sz1);
    sl4  =  -2.0 * ss3 * (-21.0 - 9.0 * emsq) * zes;
    sgh2 =   2.0 * ss4 * sz32;
    sgh3 =   2.0 * ss4 * (sz33 - sz31);
    sgh4 = -18.0 * ss4 * zes;
    sh2  =  -2.0 * ss2 * sz22;
    sh3  =  -2.0 * ss2 * (sz23 - sz21);

    //  ------------------------ do lunar terms ----------------------
    ee2  =   2.0 * s1 * s6;
    e3   =   2.0 * s1 * s7;
    xi2  =   2.0 * s2 * z12;
    xi3  =   2.0 * s2 * (z13 - z11);
    xl2  =  -2.0 * s3 * z2;
    xl3  =  -2.0 * s3 * (z3 - z1);
    xl4  =  -2.0 * s3 * (-21.0 - 9.0 * emsq) * zel;
    xgh2 =   2.0 * s4 * z32;
    xgh3 =   2.0 * s4 * (z33 - z31);
    xgh4 = -18.0 * s4 * zel;
    xh2  =  -2.0 * s2 * z22;
    xh3  =  -2.0 * s2 * (z23 - z21);

    var dscom_results =  {
        snodm : snodm,
        cnodm : cnodm,
        sinim : sinim,
        cosim : cosim,
        sinomm : sinomm,

        cosomm : cosomm,
        day : day,
        e3 : e3,
        ee2 : ee2,
        em : em,

        emsq : emsq,
        gam : gam,
        peo : peo,
        pgho : pgho,
        pho : pho,

        pinco : pinco,
        plo : plo,
        rtemsq : rtemsq,
        se2 : se2,
        se3 : se3,

        sgh2 : sgh2,
        sgh3 : sgh3,
        sgh4 : sgh4,
        sh2 : sh2,
        sh3 : sh3,

        si2 : si2,
        si3 : si3,
        sl2 : sl2,
        sl3 : sl3,
        sl4 : sl4,

        s1 : s1,
        s2 : s2,
        s3 : s3,
        s4 : s4,
        s5 : s5,

        s6 : s6,
        s7 : s7,
        ss1 : ss1,
        ss2 : ss2,
        ss3 : ss3,

        ss4 : ss4,
        ss5 : ss5,
        ss6 : ss6,
        ss7 : ss7,
        sz1 : sz1,

        sz2 : sz2,
        sz3 : sz3,
        sz11 : sz11,
        sz12 : sz12,
        sz13 : sz13,

        sz21 : sz21,
        sz22 : sz22,
        sz23 : sz23,
        sz31 : sz31,
        sz32 : sz32,

        sz33 : sz33,
        xgh2 : xgh2,
        xgh3 : xgh3,
        xgh4 : xgh4,
        xh2 : xh2,

        xh3 : xh3,
        xi2 : xi2,
        xi3 : xi3,
        xl2 : xl2,
        xl3 : xl3,

        xl4 : xl4,
        nm : nm,
        z1 : z1,
        z2 : z2,
        z3 : z3,

        z11 : z11,
        z12 : z12,
        z13 : z13,
        z21 : z21,
        z22 : z22,

        z23 : z23,
        z31 : z31,
        z32 : z32,
        z33 : z33,
        zmol : zmol,

        zmos : zmos
    };
    return dscom_results;
}

export function initl(initl_parameters){
    /*-----------------------------------------------------------------------------
    *
    *                           procedure initl
    *
    *  this procedure initializes the spg4 propagator. all the initialization is
    *    consolidated here instead of having multiple loops inside other routines.
    *
    *  author        : david vallado                  719-573-2600   28 jun 2005
    *
    *  inputs        :
    *    ecco        - eccentricity                           0.0 - 1.0
    *    epoch       - epoch time in days from jan 0, 1950. 0 hr
    *    inclo       - inclination of satellite
    *    no          - mean motion of satellite
    *    satn        - satellite number
    *
    *  outputs       :
    *    ainv        - 1.0 / a
    *    ao          - semi major axis
    *    con41       -
    *    con42       - 1.0 - 5.0 cos(i)
    *    cosio       - cosine of inclination
    *    cosio2      - cosio squared
    *    eccsq       - eccentricity squared
    *    method      - flag for deep space                    'd', 'n'
    *    omeosq      - 1.0 - ecco * ecco
    *    posq        - semi-parameter squared
    *    rp          - radius of perigee
    *    rteosq      - square root of (1.0 - ecco*ecco)
    *    sinio       - sine of inclination
    *    gsto        - gst at time of observation               rad
    *    no          - mean motion of satellite
    *
    *  locals        :
    *    ak          -
    *    d1          -
    *    del         -
    *    adel        -
    *    po          -
    *
    *  coupling      :
    *    getgravconst
    *    gstime      - find greenwich sidereal time from the julian date
    *
    *  references    :
    *    hoots, roehrich, norad spacetrack report #3 1980
    *    hoots, norad spacetrack report #6 1986
    *    hoots, schumacher and glover 2004
    *    vallado, crawford, hujsak, kelso  2006
      ----------------------------------------------------------------------------*/

    'use strict';
    var satn    = initl_parameters.satn,
        ecco    = initl_parameters.ecco,
        epoch   = initl_parameters.epoch,
        inclo   = initl_parameters.inclo,
        no      = initl_parameters.no,
        method  = initl_parameters.method,
        opsmode = initl_parameters.opsmode;

    var ak, d1,  del,  adel, po, gsto;

    // sgp4fix use old way of finding gst
    //  ----------------------- earth constants ----------------------
    //  sgp4fix identify constants and allow alternate values

    //  ------------- calculate auxillary epoch quantities ----------
    var eccsq  = ecco * ecco;
    var omeosq = 1.0 - eccsq;
    var rteosq = Math.sqrt(omeosq);
    var cosio  = Math.cos(inclo);
    var cosio2 = cosio * cosio;

    //  ------------------ un-kozai the mean motion -----------------
    ak    = Math.pow(XKE / no, 2.0/3.0);
    d1    = 0.75 * J2 * (3.0 * cosio2 - 1.0) / (rteosq * omeosq);
    var del_prime  = d1 / (ak * ak);
    adel  = ak * (1.0 - del_prime * del_prime - del_prime *
             (1.0 / 3.0 + 134.0 * del_prime * del_prime / 81.0));
    del_prime  = d1/(adel * adel);
    no    = no / (1.0 + del_prime);

    var ao    = Math.pow(XKE / no, 2.0/3.0);
    var sinio = Math.sin(inclo);
    po    = ao * omeosq;
    var con42 = 1.0 - 5.0 * cosio2;
    var con41 = -con42-cosio2-cosio2;
    var ainv  = 1.0 / ao;
    var posq  = po * po;
    var rp    = ao * (1.0 - ecco);
    method = 'n';

    //  sgp4fix modern approach to finding sidereal time
    if (opsmode === 'a') {
        //  sgp4fix use old way of finding gst
        //  count integer number of days from 0 jan 1970
        var ts70  = epoch - 7305.0;
        var ds70 = Math.floor(ts70 + 1.0e-8);
        var tfrac = ts70 - ds70;
        //  find greenwich location at epoch
        var c1    = 1.72027916940703639e-2;
        var thgr70= 1.7321343856509374;
        var fk5r  = 5.07551419432269442e-15;
        var c1p2p = c1 + twopi;
        gsto  = ( thgr70 + c1*ds70 + c1p2p*tfrac + ts70*ts70*fk5r) % twopi;
        if (gsto < 0.0){
            gsto = gsto + twopi;
        }
    }
    else {
       gsto = satellite.gstime(epoch + 2433281.5);
    }

    var initl_results = {
        no : no,

        method : method,

        ainv : ainv,
        ao : ao,
        con41 : con41,
        con42 : con42,
        cosio : cosio,

        cosio2 : cosio2,
        eccsq : eccsq,
        omeosq : omeosq,
        posq : posq,

        rp : rp,
        rteosq : rteosq,
        sinio : sinio ,
        gsto : gsto
    };
    return initl_results;
}

export function sgp4init(satrec, sgp4init_parameters){
    /*-----------------------------------------------------------------------------
    *
    *                             procedure sgp4init
    *
    *  this procedure initializes variables for sgp4.
    *
    *  author        : david vallado                  719-573-2600   28 jun 2005
    *
    *  inputs        :
    *    opsmode     - mode of operation afspc or improved 'a', 'i'
    *    satn        - satellite number
    *    bstar       - sgp4 type drag coefficient              kg/m2er
    *    ecco        - eccentricity
    *    epoch       - epoch time in days from jan 0, 1950. 0 hr
    *    argpo       - argument of perigee (output if ds)
    *    inclo       - inclination
    *    mo          - mean anomaly (output if ds)
    *    no          - mean motion
    *    nodeo       - right ascension of ascending node
    *
    *  outputs       :
    *    satrec      - common values for subsequent calls
    *    return code - non-zero on error.
    *                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
    *                   2 - mean motion less than 0.0
    *                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
    *                   4 - semi-latus rectum < 0.0
    *                   5 - epoch elements are sub-orbital
    *                   6 - satellite has decayed
    *
    *  locals        :
    *    cnodm  , snodm  , cosim  , sinim  , cosomm , sinomm
    *    cc1sq  , cc2    , cc3
    *    coef   , coef1
    *    cosio4      -
    *    day         -
    *    dndt        -
    *    em          - eccentricity
    *    emsq        - eccentricity squared
    *    eeta        -
    *    etasq       -
    *    gam         -
    *    argpm       - argument of perigee
    *    nodem       -
    *    inclm       - inclination
    *    mm          - mean anomaly
    *    nm          - mean motion
    *    perige      - perigee
    *    pinvsq      -
    *    psisq       -
    *    qzms24      -
    *    rtemsq      -
    *    s1, s2, s3, s4, s5, s6, s7          -
    *    sfour       -
    *    ss1, ss2, ss3, ss4, ss5, ss6, ss7         -
    *    sz1, sz2, sz3
    *    sz11, sz12, sz13, sz21, sz22, sz23, sz31, sz32, sz33        -
    *    tc          -
    *    temp        -
    *    temp1, temp2, temp3       -
    *    tsi         -
    *    xpidot      -
    *    xhdot1      -
    *    z1, z2, z3          -
    *    z11, z12, z13, z21, z22, z23, z31, z32, z33         -
    *
    *  coupling      :
    *    getgravconst-
    *    initl       -
    *    dscom       -
    *    dpper       -
    *    dsinit      -
    *    sgp4        -
    *
    *  references    :
    *    hoots, roehrich, norad spacetrack report #3 1980
    *    hoots, norad spacetrack report #6 1986
    *    hoots, schumacher and glover 2004
    *    vallado, crawford, hujsak, kelso  2006
      ----------------------------------------------------------------------------*/

    'use strict';

    var opsmode = sgp4init_parameters.opsmode,
        satn    = sgp4init_parameters.satn,
        epoch   = sgp4init_parameters.epoch,

        xbstar  = sgp4init_parameters.xbstar,
        xecco   = sgp4init_parameters.xecco,
        xargpo  = sgp4init_parameters.xargpo,

        xinclo  = sgp4init_parameters.xinclo,
        xmo     = sgp4init_parameters.xmo,
        xno     = sgp4init_parameters.xno,

        xnodeo  = sgp4init_parameters.xnodeo;


    var cnodm,  snodm,  cosim,  sinim,  cosomm, sinomm,
        cc1sq,  cc2,    cc3,    coef,   coef1,  cosio4,
        day,    dndt,
        em, emsq, eeta, etasq,  gam,
        argpm,  nodem,  inclm,  mm,     nm,
        perige, pinvsq, psisq,  qzms24, rtemsq,
        s1,  s2,  s3,  s4,  s5,  s6,  s7,   sfour,
        ss1,ss2,    ss3,    ss4,    ss5,    ss6,    ss7,
        sz1, sz2, sz3,
        sz11, sz12, sz13, sz21, sz22, sz23, sz31, sz32, sz33,
        tc, temp,   temp1,  temp2,  temp3,  temp4, tsi,
        xpidot, xhdot1,
        z1, z2, z3,
        z11, z12, z13, z21, z22, z23, z31, z32, z33;
     /* ------------------------ initialization --------------------- */
     // sgp4fix divisor for divide by zero check on inclination
     // the old check used 1.0 + Math.cos(pi-1.0e-9), but then compared it to
     // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency

    temp4    =   1.5e-12;

    //  ----------- set all near earth variables to zero ------------
    satrec.isimp   = 0;   satrec.method = 'n'; satrec.aycof    = 0.0;
    satrec.con41   = 0.0; satrec.cc1    = 0.0; satrec.cc4      = 0.0;
    satrec.cc5     = 0.0; satrec.d2     = 0.0; satrec.d3       = 0.0;
    satrec.d4      = 0.0; satrec.delmo  = 0.0; satrec.eta      = 0.0;
    satrec.argpdot = 0.0; satrec.omgcof = 0.0; satrec.sinmao   = 0.0;
    satrec.t       = 0.0; satrec.t2cof  = 0.0; satrec.t3cof    = 0.0;
    satrec.t4cof   = 0.0; satrec.t5cof  = 0.0; satrec.x1mth2   = 0.0;
    satrec.x7thm1  = 0.0; satrec.mdot   = 0.0; satrec.nodedot  = 0.0;
    satrec.xlcof   = 0.0; satrec.xmcof  = 0.0; satrec.nodecf   = 0.0;

    //  ----------- set all deep space variables to zero ------------
    satrec.irez  = 0;   satrec.d2201 = 0.0; satrec.d2211 = 0.0;
    satrec.d3210 = 0.0; satrec.d3222 = 0.0; satrec.d4410 = 0.0;
    satrec.d4422 = 0.0; satrec.d5220 = 0.0; satrec.d5232 = 0.0;
    satrec.d5421 = 0.0; satrec.d5433 = 0.0; satrec.dedt  = 0.0;
    satrec.del1  = 0.0; satrec.del2  = 0.0; satrec.del3  = 0.0;
    satrec.didt  = 0.0; satrec.dmdt  = 0.0; satrec.dnodt = 0.0;
    satrec.domdt = 0.0; satrec.e3    = 0.0; satrec.ee2   = 0.0;
    satrec.peo   = 0.0; satrec.pgho  = 0.0; satrec.pho   = 0.0;
    satrec.pinco = 0.0; satrec.plo   = 0.0; satrec.se2   = 0.0;
    satrec.se3   = 0.0; satrec.sgh2  = 0.0; satrec.sgh3  = 0.0;
    satrec.sgh4  = 0.0; satrec.sh2   = 0.0; satrec.sh3   = 0.0;
    satrec.si2   = 0.0; satrec.si3   = 0.0; satrec.sl2   = 0.0;
    satrec.sl3   = 0.0; satrec.sl4   = 0.0; satrec.gsto  = 0.0;
    satrec.xfact = 0.0; satrec.xgh2  = 0.0; satrec.xgh3  = 0.0;
    satrec.xgh4  = 0.0; satrec.xh2   = 0.0; satrec.xh3   = 0.0;
    satrec.xi2   = 0.0; satrec.xi3   = 0.0; satrec.xl2   = 0.0;
    satrec.xl3   = 0.0; satrec.xl4   = 0.0; satrec.xlamo = 0.0;
    satrec.zmol  = 0.0; satrec.zmos  = 0.0; satrec.atime = 0.0;
    satrec.xli   = 0.0; satrec.xni   = 0.0;


    // sgp4fix - note the following variables are also passed directly via satrec.
    // it is possible to streamline the sgp4init call by deleting the "x"
    // variables, but the user would need to set the satrec.* values first. we
    // include the additional assignments in case twoline2rv is not used.

    satrec.bstar   = xbstar;
    satrec.ecco    = xecco;
    satrec.argpo   = xargpo;
    satrec.inclo   = xinclo;
    satrec.mo      = xmo;
    satrec.no      = xno;
    satrec.nodeo   = xnodeo;

    //  sgp4fix add opsmode
    satrec.operationmode = opsmode;

    //  ------------------------ earth constants -----------------------
    //  sgp4fix identify constants and allow alternate values


    var ss     = 78.0 / EARTH_RADIUS_KM + 1.0;
    //  sgp4fix use multiply for speed instead of pow
    var qzms2ttemp = (120.0 - 78.0) / EARTH_RADIUS_KM;
    var qzms2t = qzms2ttemp * qzms2ttemp * qzms2ttemp * qzms2ttemp;
    var x2o3   =  2.0 / 3.0;

    satrec.init = 'y';
    satrec.t    = 0.0;


    var initl_parameters = {
        satn : satn,
        ecco : satrec.ecco,

        epoch : epoch,
        inclo : satrec.inclo,
        no : satrec.no,

        method : satrec.method,
        opsmode : satrec.operationmode
    };



    var initl_result= initl(initl_parameters);

    satrec.no       = initl_result.no
    var method      = initl_result.method
    var ainv        = initl_result.ainv
    var ao          = initl_result.ao
    satrec.con41    = initl_result.con41
    var con42       = initl_result.con42
    var cosio       = initl_result.cosio
    var cosio2      = initl_result.cosio2
    var eccsq       = initl_result.eccsq
    var omeosq      = initl_result.omeosq
    var posq        = initl_result.posq
    var rp          = initl_result.rp
    var rteosq      = initl_result.rteosq
    var sinio       = initl_result.sinio
    satrec.gsto     = initl_result.gsto

    satrec.error = 0;

    // sgp4fix remove this check as it is unnecessary
    // the mrt check in sgp4 handles decaying satellite cases even if the starting
    // condition is below the surface of te earth
    //     if (rp < 1.0)
    //       {
    //         printf("// *** satn%d epoch elts sub-orbital ***\n", satn);
    //         satrec.error = 5;
    //       }


    if (omeosq >= 0.0 || satrec.no >= 0.0){
        satrec.isimp = 0;
        if (rp < 220.0 / EARTH_RADIUS_KM + 1.0){
            satrec.isimp = 1;
        }
        sfour  = ss;
        qzms24 = qzms2t;
        perige = (rp - 1.0) * EARTH_RADIUS_KM;

        //  - for perigees below 156 km, s and qoms2t are altered -
        if (perige < 156.0){
             sfour = perige - 78.0;
             if (perige < 98.0){
                 sfour = 20.0;
             }
             //  sgp4fix use multiply for speed instead of pow
             var qzms24temp =  (120.0 - sfour) / EARTH_RADIUS_KM;
             qzms24 = qzms24temp * qzms24temp * qzms24temp * qzms24temp;
             sfour  = sfour / radiusearthkm + 1.0;
        }
        pinvsq = 1.0 / posq;

        tsi  = 1.0 / (ao - sfour);
        satrec.eta  = ao * satrec.ecco * tsi;
        etasq = satrec.eta * satrec.eta;
        eeta  = satrec.ecco * satrec.eta;
        psisq = Math.abs(1.0 - etasq);
        coef  = qzms24 * Math.pow(tsi, 4.0);
        coef1 = coef / Math.pow(psisq, 3.5);
        cc2   = coef1 * satrec.no * (ao * (1.0 + 1.5 * etasq + eeta *
                (4.0 + etasq)) + 0.375 * J2 * tsi / psisq * satrec.con41 *
                (8.0 + 3.0 * etasq * (8.0 + etasq)));
        satrec.cc1   = satrec.bstar * cc2;
        cc3   = 0.0;
        if (satrec.ecco > 1.0e-4){
            cc3 = -2.0 * coef * tsi * J3OJ2 * satrec.no * sinio / satrec.ecco;
        }
        satrec.x1mth2 = 1.0 - cosio2;
        satrec.cc4    = 2.0 * satrec.no * coef1 * ao * omeosq *
                           (satrec.eta * (2.0 + 0.5 * etasq) + satrec.ecco *
                           (0.5 + 2.0 * etasq) - J2 * tsi / (ao * psisq) *
                           (-3.0 * satrec.con41 * (1.0 - 2.0 * eeta + etasq *
                           (1.5 - 0.5 * eeta)) + 0.75 * satrec.x1mth2 *
                           (2.0 * etasq - eeta * (1.0 + etasq)) * Math.cos(2.0 * satrec.argpo)));
        satrec.cc5 = 2.0 * coef1 * ao * omeosq * (1.0 + 2.75 *
                       (etasq + eeta) + eeta * etasq);
        cosio4 = cosio2 * cosio2;
        temp1  = 1.5 * J2 * pinvsq * satrec.no;
        temp2  = 0.5 * temp1 * J2 * pinvsq;
        temp3  = -0.46875 * J4 * pinvsq * pinvsq * satrec.no;
        satrec.mdot     = satrec.no + 0.5 * temp1 * rteosq * satrec.con41 + 0.0625 *
                           temp2 * rteosq * (13.0 - 78.0 * cosio2 + 137.0 * cosio4);
        satrec.argpdot  = (-0.5 * temp1 * con42 + 0.0625 * temp2 *
                            (7.0 - 114.0 * cosio2 + 395.0 * cosio4) +
                            temp3 * (3.0 - 36.0 * cosio2 + 49.0 * cosio4));
        xhdot1            = -temp1 * cosio;
        satrec.nodedot = xhdot1 + (0.5 * temp2 * (4.0 - 19.0 * cosio2) +
                             2.0 * temp3 * (3.0 - 7.0 * cosio2)) * cosio;
        xpidot            =  satrec.argpdot+ satrec.nodedot;
        satrec.omgcof   = satrec.bstar * cc3 * Math.cos(satrec.argpo);
        satrec.xmcof    = 0.0;
        if (satrec.ecco > 1.0e-4){
             satrec.xmcof = -x2o3 * coef * satrec.bstar / eeta;
        }
        satrec.nodecf = 3.5 * omeosq * xhdot1 * satrec.cc1;
        satrec.t2cof   = 1.5 * satrec.cc1;
        //  sgp4fix for divide by zero with xinco = 180 deg
        if (Math.abs(cosio+1.0) > 1.5e-12){
             satrec.xlcof = -0.25 * J3OJ2 * sinio * (3.0 + 5.0 * cosio) / (1.0 + cosio);
        }
        else{
             satrec.xlcof = -0.25 * J3OJ2 * sinio * (3.0 + 5.0 * cosio) / temp4;
        }
        satrec.aycof   = -0.5 * J3OJ2 * sinio;
        //  sgp4fix use multiply for speed instead of pow
        var delmotemp = 1.0 + satrec.eta * Math.cos(satrec.mo);
        satrec.delmo   = delmotemp * delmotemp * delmotemp;
        satrec.sinmao  = Math.sin(satrec.mo);
        satrec.x7thm1  = 7.0 * cosio2 - 1.0;

        //  --------------- deep space initialization -------------
        if (2*Math.PI / satrec.no >= 225.0){
            satrec.method = 'd';
            satrec.isimp  = 1;
            tc    =  0.0;
            inclm = satrec.inclo;

            var dscom_parameters = {
                epoch : epoch,
                ep : satrec.ecco,
                argpp : satrec.argpo,
                tc : tc,
                inclp : satrec.inclo,
                nodep : satrec.nodeo,

                np : satrec.no,

                e3 : satrec.e3,
                ee2 : satrec.ee2,

                peo : satrec.peo,
                pgho : satrec.pgho,
                pho : satrec.pho,
                pinco : satrec.pinco,

                plo : satrec.plo,
                se2 : satrec.se2,
                se3 : satrec.se3,

                sgh2 : satrec.sgh2,
                sgh3 : satrec.sgh3,
                sgh4 : satrec.sgh4,

                sh2 : satrec.sh2,
                sh3 : satrec.sh3,
                si2 : satrec.si2,
                si3 : satrec.si3,

                sl2 : satrec.sl2,
                sl3 : satrec.sl3,
                sl4 : satrec.sl4,

                xgh2 : satrec.xgh2,
                xgh3 : satrec.xgh3,
                xgh4 : satrec.xgh4,
                xh2 : satrec.xh2,

                xh3 : satrec.xh3,
                xi2 : satrec.xi2,
                xi3 : satrec.xi3,
                xl2 : satrec.xl2,

                xl3 : satrec.xl3,
                xl4 : satrec.xl4,

                zmol : satrec.zmol,
                zmos : satrec.zmos
            };

            var dscom_result = dscom(dscom_parameters);

            snodm = dscom_result.snodm;
            cnodm = dscom_result.cnodm;
            sinim = dscom_result.sinim;
            cosim = dscom_result.cosim;
            sinomm = dscom_result.sinomm;

            cosomm = dscom_result.cosomm;
            day = dscom_result.day;
            satrec.e3 = dscom_result.e3;
            satrec.ee2 = dscom_result.ee2;
            em = dscom_result.em;

            emsq = dscom_result.emsq;
            gam = dscom_result.gam;
            satrec.peo = dscom_result.peo;
            satrec.pgho = dscom_result.pgho;
            satrec.pho = dscom_result.pho;

            satrec.pinco = dscom_result.pinco;
            satrec.plo = dscom_result.plo;
            rtemsq = dscom_result.rtemsq;
            satrec.se2 = dscom_result.se2;
            satrec.se3 = dscom_result.se3;

            satrec.sgh2 = dscom_result.sgh2;
            satrec.sgh3 = dscom_result.sgh3;
            satrec.sgh4 = dscom_result.sgh4;
            satrec.sh2 = dscom_result.sh2;
            satrec.sh3 = dscom_result.sh3;

            satrec.si2 = dscom_result.si2;
            satrec.si3 = dscom_result.si3;
            satrec.sl2 = dscom_result.sl2;
            satrec.sl3 = dscom_result.sl3;
            satrec.sl4 = dscom_result.sl4;

            s1 = dscom_result.s1;
            s2 = dscom_result.s2;
            s3 = dscom_result.s3;
            s4 = dscom_result.s4;
            s5 = dscom_result.s5;

            s6 = dscom_result.s6;
            s7 = dscom_result.s7;
            ss1 = dscom_result.ss1;
            ss2 = dscom_result.ss2;
            ss3 = dscom_result.ss3;

            ss4 = dscom_result.ss4;
            ss5 = dscom_result.ss5;
            ss6 = dscom_result.ss6;
            ss7 = dscom_result.ss7;
            sz1 = dscom_result.sz1;

            sz2 = dscom_result.sz2;
            sz3 = dscom_result.sz3;
            sz11 = dscom_result.sz11;
            sz12 = dscom_result.sz12;
            sz13 = dscom_result.sz13;

            sz21 = dscom_result.sz21;
            sz22 = dscom_result.sz22;
            sz23 = dscom_result.sz23;
            sz31 = dscom_result.sz31;
            sz32 = dscom_result.sz32;

            sz33 = dscom_result.sz33;
            satrec.xgh2 = dscom_result.xgh2;
            satrec.xgh3 = dscom_result.xgh3;
            satrec.xgh4 = dscom_result.xgh4;
            satrec.xh2 = dscom_result.xh2;

            satrec.xh3 = dscom_result.xh3;
            satrec.xi2 = dscom_result.xi2;
            satrec.xi3 = dscom_result.xi3;
            satrec.xl2 = dscom_result.xl2;
            satrec.xl3 = dscom_result.xl3;

            satrec.xl4 = dscom_result.xl4;
            nm = dscom_result.nm;
            z1 = dscom_result.z1;
            z2 = dscom_result.z2;
            z3 = dscom_result.z3;

            z11 = dscom_result.z11;
            z12 = dscom_result.z12;
            z13 = dscom_result.z13;
            z21 = dscom_result.z21;
            z22 = dscom_result.z22;

            z23 = dscom_result.z23;
            z31 = dscom_result.z31;
            z32 = dscom_result.z32;
            z33 = dscom_result.z33;
            satrec.zmol = dscom_result.zmol;
            satrec.zmos = dscom_result.zmos;

            var dpper_parameters = {
                inclo : inclm,
                init : satrec.init,
                ep : satrec.ecco,
                inclp : satrec.inclo,
                nodep : satrec.nodeo,
                argpp : satrec.argpo,
                mp : satrec.mo,
                opsmode : satrec.operationmode,
            };

            var dpper_result = dpper(satrec, dpper_parameters);

            satrec.ecco = dpper_result.ep;
            satrec.inclo = dpper_result.inclp;
            satrec.nodeo = dpper_result.nodep;
            satrec.argpo = dpper_result.argpp;
            satrec.mo = dpper_result.mp;

            argpm  = 0.0;
            nodem  = 0.0;
            mm     = 0.0;

            var dsinit_parameters = {
                cosim : cosim,
                emsq : emsq,
                argpo : satrec.argpo,
                s1 : s1,
                s2 : s2,
                s3 : s3,
                s4 : s4,
                s5 : s5,
                sinim : sinim,
                ss1 : ss1,
                ss2 : ss2,
                ss3 : ss3,
                ss4 : ss4,
                ss5 : ss5,
                sz1 : sz1,
                sz3 : sz3,
                sz11 : sz11,
                sz13 : sz13,
                sz21 : sz21,
                sz23 : sz23,
                sz31 : sz31,
                sz33 : sz33,
                t : satrec.t,
                tc : tc,
                gsto : satrec.gsto,
                mo : satrec.mo,
                mdot : satrec.mdot,
                no : satrec.no,
                nodeo : satrec.nodeo,
                nodedot : satrec.nodedot,
                xpidot : xpidot,
                z1 : z1,
                z3 : z3,
                z11 : z11,
                z13 : z13,
                z21 : z21,
                z23 : z23,
                z31 : z31,
                z33 : z33,
                ecco : satrec.ecco,
                eccsq : eccsq,
                em : em,
                argpm : argpm,
                inclm : inclm,
                mm : mm,
                nm : nm,
                nodem : nodem,
                irez : satrec.irez,
                atime : satrec.atime,
                d2201 : satrec.d2201,
                d2211 : satrec.d2211,
                d3210 : satrec.d3210,
                d3222 : satrec.d3222 ,
                d4410 : satrec.d4410,
                d4422 : satrec.d4422,
                d5220 : satrec.d5220,
                d5232 : satrec.d5232,
                d5421 : satrec.d5421,
                d5433 : satrec.d5433,
                dedt : satrec.dedt,
                didt : satrec.didt,
                dmdt : satrec.dmdt,
                dnodt : satrec.dnodt,
                domdt : satrec.domdt,
                del1 : satrec.del1,
                del2 : satrec.del2,
                del3 : satrec.del3,
                xfact : satrec.xfact,
                xlamo : satrec.xlamo,
                xli : satrec.xli,
                xni : satrec.xni,
            };

            var dsinit_result = dsinit( dsinit_parameters );

            em              = dsinit_result.em;
            argpm           = dsinit_result.argpm;
            inclm           = dsinit_result.inclm;
            mm              = dsinit_result.mm;
            nm              = dsinit_result.nm;

            nodem           = dsinit_result.nodem;
            satrec.irez     = dsinit_result.irez;
            satrec.atime    = dsinit_result.atime;
            satrec.d2201    = dsinit_result.d2201;
            satrec.d2211    = dsinit_result.d2211;

            satrec.d3210    = dsinit_result.d3210;
            satrec.d3222    = dsinit_result.d3222;
            satrec.d4410    = dsinit_result.d4410;
            satrec.d4422    = dsinit_result.d4422;
            satrec.d5220    = dsinit_result.d5220;

            satrec.d5232    = dsinit_result.d5232;
            satrec.d5421    = dsinit_result.d5421;
            satrec.d5433    = dsinit_result.d5433;
            satrec.dedt     = dsinit_result.dedt;
            satrec.didt     = dsinit_result.didt;

            satrec.dmdt     = dsinit_result.dmdt;
            dndt            = dsinit_result.dndt;
            satrec.dnodt    = dsinit_result.dnodt;
            satrec.domdt    = dsinit_result.domdt;
            satrec.del1     = dsinit_result.del1;

            satrec.del2     = dsinit_result.del2;
            satrec.del3     = dsinit_result.del3;
            satrec.xfact    = dsinit_result.xfact;
            satrec.xlamo    = dsinit_result.xlamo;
            satrec.xli      = dsinit_result.xli;

            satrec.xni      = dsinit_result.xni;
         }

         //----------- set variables if not deep space -----------
         if (satrec.isimp !== 1){
            cc1sq       = satrec.cc1 * satrec.cc1;
            satrec.d2   = 4.0 * ao * tsi * cc1sq;
            temp        = satrec.d2 * tsi * satrec.cc1 / 3.0;
            satrec.d3   = (17.0 * ao + sfour) * temp;
            satrec.d4   = 0.5 * temp * ao * tsi * (221.0 * ao + 31.0 * sfour) * satrec.cc1;
            satrec.t3cof= satrec.d2 + 2.0 * cc1sq;
            satrec.t4cof= 0.25 * (3.0 * satrec.d3 + satrec.cc1 *
                            (12.0 * satrec.d2 + 10.0 * cc1sq));
            satrec.t5cof= 0.2 * (3.0 * satrec.d4 +
                            12.0 * satrec.cc1 * satrec.d3 +
                            6.0 * satrec.d2 * satrec.d2 +
                            15.0 * cc1sq * (2.0 * satrec.d2 + cc1sq));
         }


       /* finally propogate to zero epoch to initialize all others. */
       // sgp4fix take out check to let satellites process until they are actually below earth surface
       //  if(satrec.error == 0)
    }
    satellite.sgp4(satrec, 0.0);

    satrec.init = 'n';

    // sgp4fix return boolean. satrec.error contains any error codes
    return true;
}
