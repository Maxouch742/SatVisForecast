<template>
  <div class="container grey-container">
    <div class="columns is-multiline">
      <!-- Use is-one-fifth to make 5 elements fit in one row -->
      <div class="column is-one-fifth"> 
        <div class="field">
          <label class="label">Easting [m]</label>
          <div class="control">
            <input class="input" id="easting" v-model="easting" type="number" placeholder="Easting" readonly>
          </div>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="field">
          <label class="label">Northing [m]</label>
          <div class="control">
            <input class="input" id="northing" v-model="northing" type="number" placeholder="Northing" readonly>
          </div>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="field">
          <label class="label">Instrument height [m]</label>
          <div class="control">
            <input class="input" id="instrumentHeight" v-model="instrumentHeight" type="number" step="0.1" placeholder="Instrument height [m]">
          </div>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="field">
          <label class="label">Elevation mask [°]</label>
          <div class="control">
            <input class="input" id="elevationMask" v-model="elevationMask" type="number" step="0.1" placeholder="Elevation mask [°]">
          </div>
        </div>
      </div>
      <div class="column is-one-fifth">
        <div class="field">
          <label class="label">Date/Time</label>
          <div class="control">
            <input class="input" id="datetime" v-model="datetime" type="datetime-local" placeholder="Date/Time">
          </div>
        </div>
      </div>
      <!-- Ensure button takes full width to move to the next line -->
      <div class="column is-full">
        <div class="field">
          <div class="control">
            <button class="button is-link is-fullwidth" @click="getGNSSvisibility">Get GNSS visibility</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

import { computed } from 'vue';
import { useCoordinatesStore } from '@/stores/coordinatesStore';
import { useMapStore } from '@/stores/mapStore';
import { useSkyPlotStore } from '@/stores/skyplotStore';
import { TleSatellite, nf02ToBessel, mn95ToWgs84 } from '@/modules-sat/api.js';
import { compute_satellite } from '@/modules-sat/compute.js';


export default {
  name: 'FormInput',

  // fields easting and northing are dynamically defined with global event and storage coordinatesStore
  setup() {
    const coordinatesStore = useCoordinatesStore();
    const easting = computed(() => coordinatesStore.easting);
    const northing = computed(() => coordinatesStore.northing);
    return {
      easting,
      northing
    };
  },

  // defaut data
  data() {
    const now = new Date(); // Get the current date and time
    const utc1Time = new Date(now.getTime() + (60 * 60 * 1000)); // Add 1 hour for UTC+1
    return {
      datetime: utc1Time.toISOString().slice(0, 16), // Sets datetime to the current date and time in UTC+1
      instrumentHeight: 1.70,
      elevationMask: 5.0,
      response: null
    };
  },
  
  
  methods: {
    
    async fetchHeight() {

      // method to fetch simple altitude from CH geo admin API
      const url = `https://api3.geo.admin.ch/rest/services/height?easting=${this.easting}&northing=${this.northing}`;
      try {
        const result = await fetch(url);
        if (!result.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await result.json();
        this.response = data
        // get the height from response
        this.height = this.response['height']
      } catch (error) {
        this.response = error.message;
      }

    },

    async responseToListsAziElev(dataStringAziElev){
      
      // formattating the response of visibiliy test (without sat.)
      let listAziElevOfRelief = dataStringAziElev.split('\n').map(line => {
        const [x, y] = line.split(';').map(Number);
        return [x, y];
      });
      return listAziElevOfRelief;

    },

    async getSatelittes(JSONrequest) {
        try {

            // Download TLE Message
            const tle_message = await TleSatellite('json');

            // Recover user-recorded date and time
            const date = new Date(JSONrequest.datetime);

            // Get receiver's position
            const obs_position = {
                "east": JSONrequest.E,
                "north": JSONrequest.N,
                "height_NF02": JSONrequest.H
            };

            // Compute position WGS84 from MN95 position
            const height_bessel = await nf02ToBessel(obs_position.east, obs_position.north, obs_position.height_NF02);
            
            // Add element to observator Object
            obs_position.height_bessel = parseFloat(height_bessel.altitude);

            // MN95/Bessel to WGS84:
            const wgs84 = await mn95ToWgs84(obs_position.east, obs_position.north, obs_position.height_bessel);
            
            // Add element to observator Object
            obs_position.latitude = parseFloat(wgs84.easting);
            obs_position.longitude = parseFloat(wgs84.northing);
            obs_position.height = parseFloat(wgs84.altitude);

            // Compute position's SV
            const res = compute_satellite(obs_position, date, tle_message);
            return res;

        } catch (error) {
            console.log("ERROR", error);
            throw error; // Rethrow the error so that it can be caught by the caller
        }
    },






    async getGNSSvisibility() {

      // MAIN PROCESS CLIENT-SIDE (WHEN 'GET' IS CLICKED)
      // ************************************************


      // =====================================
      // === GET HEIGHT FROM GEO.ADMIN API ===
      // =====================================
      // calling fetch method simple altitude from CH geo admin API
      await this.fetchHeight();


      // ==================================
      // === GET USER'S INPUT FORM DATA ===
      // ==================================
      // formatting JSON object according to form user's inputs
      const JSONrequest = {
        'E': this.easting,
        'N': this.northing,
        'H': parseFloat(this.height),
        'instrumentHeight': this.instrumentHeight,
        'elevationMask': this.elevationMask,
        'datetime': this.datetime
      };
      // logging complete request JSON
      // console.log(JSON.stringify(JSONrequest, null, 2))

      // ====================================
      // === SEND RELIEF VISIBILY REQUEST ===
      // ====================================


      // =================================
      // === SEND SAT VISIBILY REQUEST ===
      // =================================
      

      // ==============================
      // === DRAW RELIEF ON THE MAP ===
      // ==============================
      // TODO, connect the real data here !
      const listENofRelief = [[2600000,1200000], [2700000,1200000], [2700000,1100000], [2600000,1200000]]; 
      // get the stored map (gloabl)
      const mapStore = useMapStore();
      // delete layer on the map (not the background)
      mapStore.invokeClearMapLayers();
      // drawing line on 2D-map
      mapStore.invokeAddLineLayer(listENofRelief);


      // ==============================
      // === DRAW THE POLAR SKYPLOT ===
      // ==============================

      // TOPOGRAPHY MASK
      // ---------------
      // TODO: connect the real data here (from FST)
      const dataString = `
      
      0.6437;32.6121
1.2873;32.5341
2.6026;32.2736
3.2519;32.0555
4.548;32.0083
5.8395;31.8379
6.5569;31.7312
7.289;32.0909
8.7974;32.3179
9.4623;32.102
10.1247;31.8203
11.3099;30.5558
12.1443;30.0262
13.2764;29.5984
14.0362;30.2494
15.611;29.7782
16.1645;29.3662
17.0079;28.6859
18.2325;28.1434
19.2307;27.8618
20.4099;27.6513
21.5713;27.449
22.4794;27.2016
23.0394;27.1331
24.1455;26.926
25.4892;26.7031
26.0296;26.6388
27.0956;26.3439
28.4212;26.0886
29.1676;25.7777
30.4655;25.5411
31.2637;25.3762
32.25;25.0952
33.0481;25.1491
34.0075;24.594
35.2724;23.9703
36.1582;23.3871
37.6476;23.4624
38.1572;23.3222
39.0626;22.8857
40.0497;22.5604
41.0091;21.9356
42.4362;21.1765
43.3153;20.4317
44.1697;19.838
45.0;19.4428
46.1382;19.2662
47.2906;18.8538
48.0128;18.4884
49.0593;18.1333
50.1282;17.6072
51.1799;17.4721
52.2143;17.0309
53.0357;16.7581
54.1416;16.357
55.2754;16.3196
56.1818;16.2075
57.3492;16.1064
58.8775;15.9463
59.2753;15.9114
60.141;15.259
61.2476;14.6592
62.0329;14.0997
63.8745;13.528
64.9037;14.2136
65.8024;14.2313
66.9745;14.4009
67.7094;15.0479
68.3214;15.7112
69.3256;15.5558
70.9065;16.0973
71.2351;16.0683
72.1213;15.6872
73.4052;15.2891
74.876;15.4803
75.4111;16.0422
76.1486;15.9131
77.1787;15.8642
78.9436;16.1607
79.4792;16.5936
80.7398;17.8089
81.8699;18.9465
82.4879;19.1644
83.8845;20.0644
84.5597;20.5641
85.9144;21.0814
86.5936;21.2337
87.5737;21.4684
88.5185;23.0035
90.0;23.8339
90.4939;24.2532
91.4815;23.9836
92.4896;23.8229
93.5763;24.7106
94.6355;25.3531
95.1479;25.405
96.1702;25.0869
97.125;24.5107
98.2024;23.5915
99.0665;22.7089
100.2512;22.5554
101.0702;22.225
102.5288;22.4052
103.2849;22.4713
104.226;22.535
105.732;22.0065
106.3895;21.692
107.057;21.1635
108.2394;20.8106
109.0256;20.3077
110.0372;19.7475
111.1048;19.4249
112.2296;19.1116
113.0782;18.8547
114.1022;18.6703
115.1278;18.3391
116.1543;17.9858
117.1703;17.6771
118.0179;17.2997
119.31;17.3017
120.0686;17.0107
121.4091;16.5529
122.1419;16.3535
123.0957;15.9212
124.1597;15.6319
125.0958;15.1814
126.0274;14.7005
127.2079;14.2363
128.1336;13.9806
129.0531;13.645
130.1864;13.0714
131.1063;12.7504
132.0185;12.2994
133.1913;11.9105
134.1001;11.7128
135.0;11.2333
136.2293;10.6603
137.1932;10.5225
138.1397;10.3816
139.0686;9.9297
140.1521;9.3721
141.1397;8.6851
142.125;8.4101
143.1301;8.0511
144.0507;7.7073
145.0369;7.2688
146.0171;6.7564
147.0777;5.7533
148.0616;4.8067
149.1986;4.3189
150.0184;3.1996
151.049;2.3639
152.0205;1.7972
153.078;1.2769
154.1445;0.7995
155.0423;0.1973
156.5;0.0
157.5;0.0
158.5;0.0
159.5;0.0
160.5;0.0
161.5;0.0
162.5;0.0
163.5;0.0
164.5;0.0
165.5;0.0
166.9613;0.4254
167.9885;1.166
168.9174;2.1854
169.992;3.1102
170.7164;4.0969
171.8699;5.1439
172.9987;5.9922
173.991;7.9931
174.9869;8.7668
175.9858;9.1544
176.5664;10.7214
177.7543;11.8574
178.8065;13.7319
180.0;15.9448
180.0;15.9448
181.2454;16.7777
182.4366;17.2732
183.9909;18.1375
184.9697;18.3465
185.0796;18.4724
186.9811;18.6568
187.125;18.7409
188.9149;18.8774
189.888;18.9974
190.8082;19.6397
191.9908;19.9535
192.8477;20.0147
193.8075;20.2002
194.4847;20.2989
195.452;20.4179
196.1892;20.4517
197.1619;19.9806
198.178;19.9232
199.9164;19.7656
200.647;19.7872
201.3706;19.6358
202.0872;18.2897
203.1986;17.4527
204.121;16.6255
205.051;15.6722
206.0141;14.6328
207.1005;13.8808
208.0312;13.1114
209.0323;12.6727
210.0271;12.2714
211.1188;11.8299
212.6703;11.5746
213.0329;11.546
214.3178;11.0305
215.9212;10.9193
216.0426;10.9488
217.0767;10.4369
218.7516;10.0694
219.056;9.7735
220.8724;9.7119
221.9872;9.8658
222.7852;10.0641
223.8912;10.9011
225.0;11.5049
225.9935;11.8432
226.9979;12.2739
227.978;12.8026
228.9452;13.0262
229.844;13.3811
230.7743;13.779
231.9683;14.2377
232.9508;14.7739
233.9396;15.2715
234.8025;15.9487
235.9634;16.8983
236.9933;17.4337
237.7787;18.0353
238.8243;18.6608
239.3227;19.1783
240.2024;18.9741
241.321;18.8787
242.0802;18.6879
243.0478;18.3936
244.0256;18.0068
245.1943;17.7342
246.1706;17.1984
247.1452;16.5532
248.0328;16.0437
249.1254;15.5374
250.133;14.4953
251.1018;13.6038
252.0438;12.8339
253.0948;12.2405
254.1406;11.8962
255.9638;11.4085
256.5043;11.1341
257.7352;11.3674
258.6901;11.5797
259.584;11.4215
260.8698;11.9769
261.8699;12.5956
262.9835;13.342
263.5584;14.8814
264.5597;15.2993
265.9858;15.5946
266.9872;15.6738
267.9546;15.6745
268.977;15.7195
270.0;16.1784
270.6987;16.6109
271.3972;16.8226
272.7263;16.9137
273.9005;16.8557
274.548;16.8495
275.9315;16.9784
276.7536;17.0726
277.4959;17.0603
278.1301;16.9163
279.6734;16.927
280.3048;17.0859
281.5601;17.0529
282.1837;17.0208
283.4218;16.9376
284.7746;17.0307
285.9454;17.3361
286.9492;18.8598
287.9279;20.957
288.7681;21.7207
289.7595;21.9089
290.7387;22.1153
291.7054;22.38
292.9321;22.7667
293.8683;23.5418
294.9048;24.2064
295.7407;24.774
296.9728;25.303
297.9671;25.7254
298.8724;26.7201
299.9192;27.5793
300.9638;28.3911
301.8551;29.1336
302.7639;30.6382
303.2875;31.1601
304.3594;30.9423
305.8821;30.944
306.8699;30.9374
307.875;30.877
308.2695;30.7189
309.2894;30.6214
310.8878;30.7411
311.9872;31.2847
312.3458;31.1099
313.1283;30.855
314.2462;30.5759
315.0;30.3644
316.1535;30.0419
317.1476;29.6658
318.1995;29.403
319.2364;29.1909
320.1944;28.871
321.0542;28.8127
322.394;28.1691
323.2525;27.349
324.0903;26.4986
325.0453;26.0289
326.0564;25.8285
327.0721;25.6477
328.1858;25.3864
329.835;25.3027
330.4122;25.5017
331.5571;25.4773
332.4958;25.4465
333.4349;25.3672
334.0256;25.3102
335.1363;25.2137
336.1706;25.1678
337.5206;24.9371
338.7972;25.1016
339.2277;25.1878
340.9588;25.3585
341.8698;25.8359
342.646;26.2789
343.9183;26.4346
344.9696;27.2508
345.9638;27.6894
346.7294;28.2669
347.7577;28.4345
348.7992;28.6839
349.895;29.5949
350.9982;30.0355
351.4692;30.2133
352.0304;30.2013
353.5956;30.6495
354.7529;31.0205
355.2852;31.972
356.9225;32.1851
357.5104;32.3573
358.741;32.434
359.3634;32.5905

      
      `
      const listAziElevOfRelief = await this.responseToListsAziElev(dataString);
      // drawing relief on the polar chart 
      
      // SATELITTE SCATTER 
      // -----------------
      const dataSatJSON = await this.getSatelittes(JSONrequest);


      // PLOT ELEMENTS ON POLAR CHARTS
      // -----------------------------
      const skyPlotStore = useSkyPlotStore(); // get the stored chart first
      skyPlotStore.removeAllSeries(); // delete existing data first
      skyPlotStore.drawSatsOnSykPlot(dataSatJSON);  
      skyPlotStore.drawReliefOnSkyPlot(listAziElevOfRelief);









    },


  
  }
}
</script>

<style>
  .grey-container {
    padding: 20px;
    background-color: lightgrey;
    border-radius: 10px;
  }
  .label:not(:last-child) {
    margin-bottom: 0.0em !important;
  }
  .column {
      display: block;
      flex-basis: 0;
      flex-grow: 1;
      flex-shrink: 1;
      padding: 0.3rem !important;
  }
</style>
