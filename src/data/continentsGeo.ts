// Simplified but accurate continent outlines (~1–2° resolution).
// Coordinates are (lon, lat) pairs tracing each coastline clockwise.

export type GeoPoint = { lon: number; lat: number };

export const CONTINENT_POLYGONS: Record<string, GeoPoint[]> = {

  africa: [
    // NW Morocco → Mediterranean
    {lon:-6.0,lat:35.8},{lon:-2.5,lat:35.2},{lon:0.0,lat:35.7},
    {lon:2.5,lat:36.8},{lon:5.0,lat:37.0},{lon:7.2,lat:37.1},
    {lon:9.0,lat:37.4},{lon:10.2,lat:37.0},{lon:11.0,lat:36.8},
    // Libya
    {lon:11.5,lat:33.5},{lon:12.0,lat:32.5},{lon:13.5,lat:31.9},
    {lon:15.0,lat:31.0},{lon:17.0,lat:30.5},{lon:20.0,lat:30.5},
    {lon:22.5,lat:30.5},{lon:25.0,lat:31.5},{lon:28.0,lat:30.5},
    // Egypt / Sinai
    {lon:30.0,lat:31.0},{lon:32.0,lat:31.0},{lon:32.5,lat:30.5},
    {lon:33.5,lat:29.5},{lon:34.2,lat:28.0},{lon:35.0,lat:26.5},
    // Red Sea coast
    {lon:36.5,lat:24.0},{lon:37.5,lat:21.0},{lon:38.5,lat:18.5},
    {lon:39.5,lat:16.0},{lon:40.5,lat:13.5},{lon:41.5,lat:11.5},
    // Horn of Africa
    {lon:42.5,lat:11.0},{lon:43.5,lat:11.5},{lon:44.5,lat:10.5},
    {lon:46.5,lat:10.5},{lon:45.5,lat:8.5},{lon:44.5,lat:6.5},
    {lon:44.0,lat:4.5},{lon:43.0,lat:2.5},
    // East African coast
    {lon:41.5,lat:1.5},{lon:41.0,lat:-1.5},{lon:40.5,lat:-4.5},
    {lon:40.2,lat:-7.5},{lon:40.0,lat:-10.5},{lon:39.5,lat:-13.0},
    {lon:38.5,lat:-15.5},{lon:36.0,lat:-18.0},
    // Mozambique → South Africa
    {lon:35.0,lat:-20.5},{lon:35.3,lat:-23.5},{lon:34.5,lat:-26.0},
    {lon:33.0,lat:-29.5},{lon:30.0,lat:-31.0},
    {lon:27.5,lat:-33.5},{lon:24.0,lat:-34.5},{lon:22.0,lat:-34.5},
    {lon:18.5,lat:-34.8},{lon:16.5,lat:-33.5},{lon:14.0,lat:-31.0},
    {lon:12.5,lat:-24.0},{lon:11.8,lat:-18.5},
    // Angola
    {lon:12.0,lat:-15.0},{lon:11.5,lat:-11.0},{lon:10.0,lat:-6.5},
    {lon:9.5,lat:-2.5},{lon:8.5,lat:1.0},
    // Gulf of Guinea
    {lon:8.5,lat:4.0},{lon:3.5,lat:4.5},{lon:2.5,lat:5.3},
    {lon:1.0,lat:5.5},{lon:-0.5,lat:5.0},{lon:-2.5,lat:5.0},
    {lon:-4.5,lat:5.0},{lon:-5.5,lat:5.1},{lon:-7.5,lat:4.4},
    {lon:-9.5,lat:5.0},{lon:-11.0,lat:6.5},{lon:-11.5,lat:9.0},
    {lon:-11.5,lat:11.0},
    // Senegal / Mauritania
    {lon:-13.0,lat:12.5},{lon:-14.8,lat:11.0},{lon:-15.5,lat:11.5},
    {lon:-16.5,lat:12.5},{lon:-17.0,lat:14.7},
    {lon:-17.0,lat:16.5},{lon:-16.5,lat:19.5},{lon:-16.0,lat:22.0},
    {lon:-14.0,lat:26.0},{lon:-9.0,lat:27.7},{lon:-6.0,lat:29.5},
    // Morocco W coast → start
    {lon:-2.5,lat:30.5},{lon:-2.0,lat:31.5},{lon:-3.0,lat:32.5},
    {lon:-5.2,lat:33.5},{lon:-5.5,lat:35.0},{lon:-6.0,lat:35.8},
  ],

  europe: [
    // Portugal W coast
    {lon:-9.2,lat:37.0},{lon:-8.5,lat:38.0},{lon:-8.8,lat:38.5},
    {lon:-9.0,lat:39.5},{lon:-8.5,lat:41.0},{lon:-8.5,lat:43.7},
    // N Spain
    {lon:-6.0,lat:43.6},{lon:-4.0,lat:43.5},{lon:-2.0,lat:43.5},
    {lon:0.0,lat:43.4},{lon:3.0,lat:43.5},{lon:5.0,lat:43.5},
    // French / Ligurian coast
    {lon:6.5,lat:43.5},{lon:7.5,lat:43.8},{lon:8.5,lat:44.0},
    {lon:9.5,lat:44.0},{lon:10.5,lat:43.5},{lon:11.5,lat:43.5},
    {lon:12.5,lat:44.0},{lon:13.5,lat:44.5},
    // Italian boot (down and back)
    {lon:14.5,lat:41.5},{lon:15.5,lat:40.0},{lon:16.0,lat:38.5},
    {lon:15.5,lat:37.0},{lon:14.0,lat:38.0},{lon:12.5,lat:38.0},
    {lon:11.5,lat:38.5},
    // Adriatic / Balkans
    {lon:13.5,lat:45.5},{lon:14.5,lat:45.2},{lon:16.0,lat:44.5},
    {lon:17.5,lat:43.0},{lon:18.5,lat:42.5},{lon:20.0,lat:40.5},
    // Greece
    {lon:22.0,lat:40.5},{lon:24.0,lat:40.7},{lon:25.5,lat:40.0},
    {lon:26.5,lat:41.0},{lon:27.5,lat:41.0},
    // Black Sea
    {lon:28.5,lat:42.0},{lon:30.0,lat:45.0},{lon:31.0,lat:46.5},
    {lon:33.0,lat:46.5},{lon:37.5,lat:47.0},
    // Russia W
    {lon:39.5,lat:47.5},{lon:40.0,lat:50.0},{lon:39.0,lat:53.0},
    {lon:37.5,lat:55.5},{lon:32.0,lat:57.5},{lon:27.5,lat:59.0},
    // Baltic / Scandinavia
    {lon:22.5,lat:60.0},{lon:20.0,lat:59.5},{lon:18.5,lat:60.0},
    {lon:15.0,lat:58.0},{lon:12.5,lat:57.0},{lon:11.0,lat:57.5},
    {lon:10.5,lat:58.5},{lon:8.5,lat:58.5},{lon:5.0,lat:58.5},
    {lon:4.5,lat:58.0},
    // Netherlands / N France
    {lon:4.5,lat:53.0},{lon:3.0,lat:51.5},{lon:2.5,lat:51.0},
    {lon:1.5,lat:50.7},{lon:0.0,lat:50.0},{lon:-2.0,lat:49.5},
    {lon:-4.5,lat:47.5},{lon:-4.7,lat:48.5},
    // Bay of Biscay
    {lon:-2.0,lat:47.0},{lon:-1.5,lat:46.0},{lon:-1.5,lat:44.0},
    {lon:-2.5,lat:43.5},
    // Iberia W coast → S coast → start
    {lon:-8.5,lat:43.5},{lon:-9.0,lat:43.0},{lon:-9.0,lat:40.5},
    {lon:-8.5,lat:37.5},{lon:-6.5,lat:36.5},{lon:-5.5,lat:36.0},
    {lon:-2.0,lat:37.0},{lon:0.0,lat:37.5},
    {lon:-2.0,lat:36.7},{lon:-5.5,lat:36.0},{lon:-8.5,lat:37.0},
    {lon:-9.2,lat:37.0},
  ],

  asia: [
    // Turkey W (Bosphorus) → Mediterranean S coast
    {lon:29.0,lat:41.5},{lon:27.0,lat:40.0},{lon:26.5,lat:38.5},
    {lon:27.5,lat:37.0},{lon:29.5,lat:36.0},{lon:31.5,lat:36.0},
    {lon:34.5,lat:36.5},{lon:36.0,lat:36.5},
    // Syria / Lebanon / Israel
    {lon:36.0,lat:36.0},{lon:35.5,lat:33.5},{lon:35.0,lat:32.5},
    {lon:34.5,lat:31.5},{lon:34.8,lat:29.5},
    // Red Sea E coast (Arabia)
    {lon:37.5,lat:28.0},{lon:39.0,lat:27.0},{lon:40.0,lat:24.5},
    {lon:40.5,lat:22.0},{lon:41.0,lat:20.0},{lon:42.0,lat:18.5},
    {lon:43.0,lat:16.5},{lon:43.5,lat:14.5},{lon:45.0,lat:12.5},
    // Yemen S coast
    {lon:45.5,lat:12.0},{lon:46.5,lat:11.5},{lon:48.0,lat:12.0},
    {lon:50.0,lat:12.5},{lon:52.0,lat:13.5},
    // Oman
    {lon:53.5,lat:16.5},{lon:54.0,lat:18.0},{lon:55.5,lat:20.0},
    {lon:57.5,lat:22.5},{lon:58.5,lat:23.5},{lon:59.5,lat:23.5},
    // UAE / Gulf
    {lon:56.5,lat:24.5},{lon:55.0,lat:25.5},
    {lon:51.5,lat:26.0},{lon:50.5,lat:25.5},{lon:48.5,lat:26.5},
    {lon:47.5,lat:27.5},{lon:46.5,lat:30.5},{lon:47.5,lat:31.5},
    // Iraq / Iran S coast
    {lon:48.5,lat:30.5},{lon:50.0,lat:28.5},{lon:52.5,lat:26.5},
    {lon:56.0,lat:25.5},{lon:60.5,lat:24.5},{lon:62.0,lat:25.0},
    {lon:63.5,lat:24.5},{lon:65.5,lat:24.0},{lon:68.0,lat:23.0},
    // India W coast → tip → E coast
    {lon:68.5,lat:22.5},{lon:68.0,lat:20.5},{lon:72.0,lat:20.0},
    {lon:72.5,lat:18.0},{lon:73.5,lat:16.5},{lon:74.5,lat:14.5},
    {lon:76.0,lat:12.0},{lon:77.5,lat:9.0},{lon:77.5,lat:8.1},
    {lon:80.0,lat:8.5},{lon:80.5,lat:9.5},{lon:81.0,lat:10.5},
    {lon:80.5,lat:13.5},{lon:80.0,lat:15.0},{lon:80.3,lat:17.0},
    {lon:82.0,lat:18.5},{lon:85.0,lat:20.0},{lon:86.5,lat:21.0},
    {lon:87.5,lat:22.0},{lon:88.0,lat:22.5},{lon:90.5,lat:22.5},
    // Bangladesh / Myanmar
    {lon:92.0,lat:22.0},{lon:92.5,lat:23.5},{lon:94.0,lat:23.0},
    {lon:95.0,lat:22.0},{lon:96.5,lat:20.0},{lon:97.5,lat:17.5},
    // Indochina / Malay Peninsula
    {lon:99.5,lat:14.5},{lon:100.0,lat:12.0},{lon:100.5,lat:7.5},
    {lon:101.5,lat:4.0},{lon:103.5,lat:1.5},{lon:104.0,lat:1.3},
    // Malay E coast
    {lon:103.5,lat:3.0},{lon:103.5,lat:5.5},{lon:103.0,lat:6.5},
    {lon:102.5,lat:8.0},{lon:103.0,lat:10.5},
    // Vietnam / S China coast
    {lon:104.5,lat:12.5},{lon:106.5,lat:11.0},{lon:108.0,lat:12.0},
    {lon:109.0,lat:13.5},{lon:109.5,lat:16.0},{lon:108.5,lat:17.5},
    {lon:107.5,lat:20.0},
    {lon:108.0,lat:21.5},{lon:110.0,lat:21.5},{lon:112.0,lat:21.5},
    {lon:113.5,lat:22.3},{lon:115.5,lat:23.0},{lon:117.5,lat:24.0},
    {lon:120.0,lat:25.5},{lon:120.5,lat:24.0},
    // Fujian → Yangtze → Yellow Sea
    {lon:121.5,lat:30.0},{lon:121.0,lat:31.5},{lon:122.0,lat:32.0},
    {lon:121.0,lat:33.0},{lon:120.0,lat:35.0},{lon:119.5,lat:37.0},
    {lon:120.5,lat:38.0},{lon:120.0,lat:39.5},
    // Korea / Manchuria
    {lon:121.5,lat:40.5},{lon:120.5,lat:42.0},{lon:122.5,lat:47.0},
    {lon:126.0,lat:49.5},{lon:128.5,lat:50.0},
    // Russian Far East
    {lon:133.0,lat:48.5},{lon:135.5,lat:48.5},{lon:141.0,lat:46.5},
    {lon:141.5,lat:43.5},{lon:143.0,lat:47.0},{lon:142.0,lat:48.5},
    {lon:140.5,lat:53.5},{lon:135.5,lat:55.0},
    {lon:130.0,lat:58.0},{lon:129.5,lat:60.5},
    // Siberian N coast (simplified)
    {lon:135.0,lat:60.5},{lon:140.0,lat:62.5},{lon:145.0,lat:65.0},
    {lon:150.0,lat:68.0},{lon:155.0,lat:68.5},{lon:158.0,lat:70.0},
    {lon:163.0,lat:71.0},{lon:170.0,lat:70.5},{lon:175.0,lat:68.0},
    // Arctic coast going W
    {lon:170.0,lat:65.0},{lon:164.0,lat:63.5},
    {lon:160.0,lat:60.5},{lon:153.0,lat:59.5},
    {lon:149.0,lat:60.0},{lon:142.5,lat:60.5},
    {lon:140.0,lat:60.0},{lon:139.0,lat:58.5},
    // W Siberia
    {lon:130.0,lat:55.0},{lon:120.0,lat:55.0},{lon:110.0,lat:56.5},
    {lon:100.0,lat:55.5},{lon:90.0,lat:57.0},
    {lon:80.0,lat:58.0},{lon:72.0,lat:57.5},
    {lon:66.0,lat:55.0},{lon:62.0,lat:52.0},
    // Caspian / Russia N of Caspian
    {lon:60.0,lat:55.0},{lon:58.0,lat:57.0},{lon:56.0,lat:56.5},
    {lon:50.0,lat:57.0},{lon:50.5,lat:51.5},{lon:48.5,lat:47.5},
    {lon:47.0,lat:44.5},
    // Caucasus → Turkey N coast
    {lon:46.0,lat:43.5},{lon:44.0,lat:43.0},{lon:42.0,lat:43.5},
    {lon:40.0,lat:43.5},{lon:41.5,lat:42.0},{lon:42.0,lat:41.0},
    {lon:40.5,lat:41.0},{lon:38.5,lat:41.5},{lon:37.0,lat:41.5},
    {lon:35.5,lat:42.0},{lon:33.5,lat:42.0},{lon:32.0,lat:42.0},
    {lon:31.0,lat:41.5},{lon:29.0,lat:41.5},
  ],

  northAmerica: [
    // NW Alaska
    {lon:-168.0,lat:56.0},{lon:-164.0,lat:54.5},{lon:-162.0,lat:55.5},
    {lon:-160.0,lat:57.5},{lon:-156.0,lat:57.5},
    {lon:-154.0,lat:58.5},{lon:-152.0,lat:58.0},{lon:-150.0,lat:59.5},
    {lon:-146.0,lat:60.0},{lon:-141.0,lat:60.0},
    // BC / Pacific coast
    {lon:-136.0,lat:58.0},{lon:-133.0,lat:56.5},{lon:-130.0,lat:56.0},
    {lon:-128.5,lat:53.0},{lon:-126.5,lat:50.5},{lon:-125.5,lat:49.5},
    {lon:-124.0,lat:48.5},{lon:-124.0,lat:47.0},{lon:-124.5,lat:43.5},
    {lon:-124.5,lat:39.5},{lon:-122.5,lat:37.5},
    // California / Baja
    {lon:-120.5,lat:35.0},{lon:-120.0,lat:31.0},{lon:-117.0,lat:32.5},
    {lon:-116.5,lat:31.0},{lon:-109.5,lat:23.0},
    // Mexico W coast
    {lon:-105.5,lat:21.5},{lon:-105.0,lat:19.5},{lon:-104.5,lat:18.5},
    // Central America Pacific
    {lon:-97.5,lat:16.0},{lon:-91.5,lat:15.5},{lon:-90.0,lat:14.5},
    {lon:-88.0,lat:13.0},{lon:-85.0,lat:11.5},{lon:-83.5,lat:10.0},
    {lon:-82.5,lat:9.0},{lon:-77.5,lat:8.0},
    // Caribbean coast / Venezuela
    {lon:-76.5,lat:10.0},{lon:-75.0,lat:11.5},{lon:-70.0,lat:11.5},
    {lon:-68.5,lat:11.0},{lon:-66.0,lat:10.5},{lon:-61.5,lat:10.5},
    {lon:-60.0,lat:8.5},
    // Mexico Gulf coast
    {lon:-87.0,lat:16.0},{lon:-87.5,lat:18.5},{lon:-87.5,lat:21.5},
    {lon:-87.0,lat:20.0},{lon:-88.5,lat:20.0},{lon:-90.5,lat:21.0},
    {lon:-91.5,lat:18.5},{lon:-94.5,lat:18.5},
    {lon:-96.0,lat:19.5},{lon:-97.5,lat:22.0},{lon:-97.5,lat:26.5},
    // Texas / Gulf coast
    {lon:-97.0,lat:28.0},{lon:-94.5,lat:29.5},{lon:-89.5,lat:29.5},
    {lon:-89.0,lat:30.0},{lon:-85.5,lat:30.0},{lon:-84.0,lat:30.0},
    {lon:-82.5,lat:29.0},{lon:-82.0,lat:27.5},{lon:-81.5,lat:25.0},
    // Florida
    {lon:-80.0,lat:25.0},{lon:-80.0,lat:27.5},
    {lon:-80.5,lat:29.5},{lon:-81.0,lat:31.0},
    // SE / E coast
    {lon:-80.5,lat:32.0},{lon:-77.5,lat:34.5},
    {lon:-75.0,lat:37.5},{lon:-75.5,lat:38.5},{lon:-74.5,lat:39.5},
    {lon:-73.5,lat:41.0},{lon:-70.0,lat:42.5},{lon:-70.5,lat:43.5},
    // Maritime Canada
    {lon:-67.0,lat:44.5},{lon:-65.0,lat:45.5},{lon:-60.0,lat:46.5},
    {lon:-59.5,lat:47.5},{lon:-58.0,lat:48.5},
    {lon:-55.5,lat:47.0},{lon:-53.5,lat:47.5},{lon:-56.0,lat:50.0},
    // Labrador
    {lon:-55.0,lat:52.0},{lon:-56.0,lat:53.5},{lon:-60.0,lat:56.0},
    {lon:-64.5,lat:58.5},{lon:-65.5,lat:60.0},
    {lon:-63.0,lat:63.5},{lon:-68.5,lat:63.5},{lon:-79.0,lat:62.5},
    // Hudson Bay shore (simplified)
    {lon:-82.5,lat:55.5},{lon:-79.5,lat:51.0},{lon:-82.0,lat:48.5},
    {lon:-83.5,lat:46.0},{lon:-86.5,lat:48.0},{lon:-89.5,lat:48.0},
    {lon:-95.5,lat:49.0},{lon:-110.0,lat:49.0},
    {lon:-120.0,lat:49.0},{lon:-124.0,lat:49.0},
    // BC coast
    {lon:-128.5,lat:52.0},{lon:-130.0,lat:54.0},
    {lon:-126.0,lat:58.5},{lon:-122.0,lat:60.0},
    {lon:-141.0,lat:60.0},
    // N Alaska coast
    {lon:-166.0,lat:68.0},{lon:-163.0,lat:70.5},{lon:-156.0,lat:72.5},
    {lon:-148.0,lat:71.0},{lon:-140.0,lat:70.5},
    // Mackenzie / NW Territories
    {lon:-136.0,lat:69.5},{lon:-120.0,lat:69.5},
    {lon:-112.0,lat:69.5},{lon:-105.5,lat:69.0},
    {lon:-103.5,lat:68.5},{lon:-97.0,lat:65.5},{lon:-95.0,lat:68.0},
    {lon:-89.5,lat:67.5},{lon:-87.5,lat:65.0},{lon:-87.5,lat:63.5},
    {lon:-86.5,lat:62.5},{lon:-84.0,lat:64.0},{lon:-79.0,lat:63.5},
  ],

  southAmerica: [
    // N coast Venezuela / Colombia
    {lon:-72.0,lat:12.0},{lon:-70.0,lat:11.5},{lon:-68.5,lat:11.0},
    {lon:-66.0,lat:10.5},{lon:-61.5,lat:10.5},{lon:-60.0,lat:8.0},
    // Guyana coast
    {lon:-60.0,lat:7.0},{lon:-57.5,lat:6.0},{lon:-54.0,lat:4.5},
    {lon:-52.5,lat:4.0},{lon:-51.0,lat:4.0},{lon:-50.5,lat:3.0},
    // Mouth of Amazon → Brazil N
    {lon:-48.5,lat:1.0},{lon:-48.0,lat:-1.5},{lon:-47.5,lat:-2.5},
    {lon:-45.0,lat:-3.0},{lon:-42.0,lat:-3.5},{lon:-37.5,lat:-4.5},
    {lon:-35.5,lat:-5.0},
    // Brazil E bulge (Cabo Branco)
    {lon:-34.5,lat:-7.0},{lon:-35.0,lat:-8.5},{lon:-35.0,lat:-10.0},
    {lon:-36.5,lat:-11.5},{lon:-38.0,lat:-13.0},{lon:-39.5,lat:-15.0},
    {lon:-40.0,lat:-16.5},{lon:-39.5,lat:-18.5},{lon:-40.5,lat:-19.5},
    // SE Brazil
    {lon:-40.5,lat:-20.5},{lon:-41.5,lat:-21.5},{lon:-43.0,lat:-22.0},
    {lon:-44.5,lat:-23.0},{lon:-46.5,lat:-24.0},{lon:-47.0,lat:-24.5},
    {lon:-48.0,lat:-25.5},{lon:-48.5,lat:-27.0},{lon:-48.5,lat:-28.5},
    // S Brazil / Uruguay
    {lon:-50.0,lat:-30.0},{lon:-51.5,lat:-30.0},{lon:-53.5,lat:-32.0},
    {lon:-53.5,lat:-34.0},
    // Argentina / Patagonia
    {lon:-55.0,lat:-35.5},{lon:-56.5,lat:-37.0},{lon:-57.0,lat:-38.0},
    {lon:-58.5,lat:-41.5},{lon:-60.0,lat:-43.0},{lon:-62.0,lat:-44.5},
    {lon:-63.5,lat:-46.5},{lon:-65.5,lat:-47.5},{lon:-66.0,lat:-50.0},
    {lon:-67.5,lat:-52.0},{lon:-68.0,lat:-54.5},
    // Cape Horn
    {lon:-66.0,lat:-55.5},{lon:-65.5,lat:-55.0},{lon:-68.0,lat:-54.5},
    // Chile W coast going N
    {lon:-70.5,lat:-52.0},{lon:-72.5,lat:-50.0},{lon:-73.0,lat:-47.5},
    {lon:-74.5,lat:-45.5},{lon:-75.5,lat:-43.5},
    {lon:-75.5,lat:-41.0},{lon:-74.5,lat:-38.5},{lon:-73.0,lat:-36.0},
    {lon:-72.0,lat:-33.5},{lon:-71.5,lat:-30.5},{lon:-70.5,lat:-27.0},
    {lon:-71.0,lat:-24.0},{lon:-70.0,lat:-21.5},{lon:-70.0,lat:-19.0},
    {lon:-70.0,lat:-17.0},{lon:-75.5,lat:-13.5},{lon:-77.0,lat:-10.0},
    {lon:-77.5,lat:-8.0},{lon:-80.0,lat:-5.5},{lon:-80.5,lat:-3.5},
    {lon:-80.0,lat:-2.0},{lon:-80.5,lat:0.0},{lon:-80.0,lat:1.5},
    // Ecuador / Colombia W coast
    {lon:-78.0,lat:2.0},{lon:-77.5,lat:5.0},{lon:-77.5,lat:8.0},
    {lon:-77.0,lat:8.5},{lon:-75.0,lat:10.5},{lon:-72.0,lat:12.0},
  ],

  australia: [
    // SE corner → E coast going N
    {lon:148.0,lat:-39.0},{lon:150.5,lat:-37.5},{lon:151.0,lat:-34.5},
    {lon:151.5,lat:-32.0},{lon:153.5,lat:-29.0},{lon:153.5,lat:-26.5},
    {lon:153.0,lat:-24.5},{lon:151.5,lat:-23.0},{lon:151.5,lat:-22.0},
    {lon:150.5,lat:-21.0},{lon:149.5,lat:-20.0},{lon:148.5,lat:-19.5},
    {lon:147.0,lat:-19.0},{lon:146.0,lat:-18.5},{lon:145.5,lat:-17.5},
    // Cape York Peninsula
    {lon:145.0,lat:-15.0},{lon:145.5,lat:-14.5},{lon:145.5,lat:-13.0},
    {lon:144.0,lat:-11.0},{lon:143.5,lat:-10.5},{lon:141.5,lat:-10.5},
    // Gulf of Carpentaria
    {lon:140.0,lat:-13.5},{lon:139.5,lat:-16.5},{lon:137.5,lat:-15.5},
    {lon:136.5,lat:-13.5},{lon:135.5,lat:-13.0},{lon:134.0,lat:-12.5},
    {lon:133.0,lat:-12.5},{lon:131.5,lat:-12.0},{lon:130.5,lat:-12.5},
    {lon:130.5,lat:-13.5},
    // Darwin / NW coast
    {lon:131.0,lat:-11.5},{lon:130.0,lat:-11.5},{lon:129.5,lat:-14.0},
    {lon:128.5,lat:-14.5},{lon:125.5,lat:-13.5},{lon:124.5,lat:-14.5},
    {lon:123.5,lat:-15.5},{lon:122.0,lat:-16.5},{lon:121.5,lat:-17.5},
    // Kimberley / NW
    {lon:120.0,lat:-19.0},{lon:118.5,lat:-20.5},{lon:117.5,lat:-21.5},
    {lon:114.5,lat:-22.0},{lon:114.0,lat:-21.5},{lon:113.5,lat:-22.0},
    {lon:113.5,lat:-25.0},{lon:114.0,lat:-26.5},{lon:114.5,lat:-28.0},
    // W coast → SW
    {lon:114.0,lat:-30.0},{lon:115.0,lat:-31.5},{lon:115.5,lat:-33.5},
    {lon:116.5,lat:-35.0},{lon:117.5,lat:-35.5},{lon:119.5,lat:-34.5},
    // Great Australian Bight
    {lon:121.5,lat:-34.5},{lon:124.0,lat:-34.0},{lon:126.5,lat:-34.0},
    {lon:129.0,lat:-34.5},{lon:132.0,lat:-34.5},{lon:135.0,lat:-35.0},
    {lon:137.5,lat:-35.5},{lon:139.5,lat:-36.0},{lon:140.5,lat:-36.5},
    // SE coast → start
    {lon:141.5,lat:-38.5},{lon:143.0,lat:-39.0},{lon:144.5,lat:-38.5},
    {lon:145.5,lat:-39.0},{lon:148.0,lat:-39.0},
  ],

  greenland: [
    {lon:-50.0,lat:59.8},{lon:-45.0,lat:60.0},{lon:-42.0,lat:61.5},
    {lon:-40.0,lat:65.5},{lon:-38.5,lat:68.0},{lon:-22.0,lat:70.5},
    {lon:-18.5,lat:73.5},{lon:-20.0,lat:75.0},{lon:-19.5,lat:77.0},
    {lon:-22.0,lat:79.0},{lon:-25.0,lat:80.5},{lon:-30.0,lat:82.5},
    {lon:-45.0,lat:83.5},{lon:-55.0,lat:83.0},{lon:-63.0,lat:82.5},
    {lon:-67.0,lat:81.0},{lon:-68.5,lat:79.5},{lon:-72.0,lat:78.5},
    {lon:-73.5,lat:77.0},{lon:-72.0,lat:75.5},{lon:-68.5,lat:73.5},
    {lon:-54.0,lat:70.0},{lon:-53.0,lat:68.5},{lon:-52.0,lat:67.0},
    {lon:-53.5,lat:65.5},{lon:-53.5,lat:64.0},{lon:-52.0,lat:62.5},
    {lon:-50.0,lat:59.8},
  ],
};

// Geographic centroid for each landmass — used to skip back-face rendering.
export const CONTINENT_CENTROIDS: Record<string, { lon: number; lat: number }> = {
  africa:       { lon: 17.0, lat:  5.0 },
  europe:       { lon: 15.0, lat: 54.0 },
  asia:         { lon: 95.0, lat: 45.0 },
  northAmerica: { lon:-100.0, lat: 50.0 },
  southAmerica: { lon: -55.0, lat:-15.0 },
  australia:    { lon: 133.0, lat:-27.0 },
  greenland:    { lon: -42.0, lat: 74.0 },
};
