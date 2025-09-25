import { busRoutes } from "./data/bus-routes";
import { departureTimes } from "./data/time-tables";
import { WayDirections } from "./data/enums";
import * as fs from 'fs';

// App

runBusRouteConverter();

// Functions

function runBusRouteConverter(): void {
  const newBusRoutes: any[] = convertAllBusRoutes(busRoutes, departureTimes);
  console.log(newBusRoutes);
  writeData(newBusRoutes, "../json/new-bus-routes.json");
}

function createNewBusRouteObject(busRoute: any[], departureTimes: string[][], wayDirection: WayDirections): any {
  let newBusRoute: any = {};

  const busName: string = busRoute[0];
  const busStops: string[] = busRoute[1];
  const indexOfStartTerminus: number = wayDirection === WayDirections.Forward ? 0 : busRoute[2]; // 3
  const indexOfEndTerminus: number = wayDirection === WayDirections.Forward ? busRoute[2] : 0; // 0

  newBusRoute["bus name"] = busName;
  newBusRoute["start terminus"] = createBusStopObject(busStops[indexOfStartTerminus], departureTimes[indexOfStartTerminus]);

  // For cicle datas
  const index: number = wayDirection === WayDirections.Forward ? 1 : indexOfStartTerminus + 1;
  const condition: number = wayDirection === WayDirections.Forward ? busStops.length - (indexOfEndTerminus + 1) : busStops.length - 1;
  let busStopCounter: number = 0;

  for (let i = index; i < condition; i++) {
    busStopCounter++;
    newBusRoute[`stop ${busStopCounter}`] = createBusStopObject(busStops[i], departureTimes[i]);
  }

  newBusRoute["end terminus"] = createBusStopObject(busStops[indexOfEndTerminus], departureTimes[indexOfEndTerminus], "end terminus");

  return newBusRoute;
}

function createBusStopObject(busStopName: string, departureTimes: string[], terminusType?: string): any {
  if (terminusType) {
    return {
      name: busStopName
    }
  }

  return {
    name: busStopName,
    departures: JSON.stringify(departureTimes)
  }
}

function convertAllBusRoutes(busRoutes: any[], departureTimes: string[][][]): any[] {
  const newBusRoutes: any[] = [];

  for (let i = 0; i < busRoutes.length; i++) {
    newBusRoutes.push(createNewBusRouteObject(busRoutes[i], departureTimes[i], WayDirections.Forward));
    newBusRoutes.push(createNewBusRouteObject(busRoutes[i], departureTimes[i], WayDirections.Backwards));
  }

  return newBusRoutes;
}

function writeData(newBusRoutes: any[], filePath: string): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(newBusRoutes, null, 2), "utf8");
  } catch (error) {
    console.log("Catch error in the writeData function!", error)
  }
}
