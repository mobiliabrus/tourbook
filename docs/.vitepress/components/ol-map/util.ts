export function parsePoint(point: unknown): [number, number] | void {
  if (typeof point === 'string') {
    const [lng, lat] = point.split(',');
    return [Number(lng), Number(lat)];
  }
}

export function parsePoints(points: unknown): any[] | [] {
  if (typeof points === 'string') {
    return points.split(/[;|]{1}/)
      .map((points) => {
        const [lng, lat, ...label] = points.split(',')
        return [lng?.trim(), lat?.trim(), label.join(',')]
      })
      .filter(([lng, lat]) => lng && lat && Number.isFinite(Number(lng)) && Number.isFinite(Number(lat)))
  }
  return []
}

export function parseFlights(flights: unknown): any[] | [] {
  if (typeof flights === 'string') {
    return flights.split('|').map((flight) => {
      const [from, to, times] = flight.split(/[~;]/);
      return [from.split(','), to.split(','), times];
    });
  }
  return [];
}
