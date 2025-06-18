// Standard distances in meters - Dan Bizzarro Method official guidelines
export const standardDistances = {
  "walk-poles": {
    "small-pony": { distance: 0.6, description: "Walk poles - small pony (<13hh): 60cm" },
    "big-pony": { distance: 0.7, description: "Walk poles - big pony (13-14.2hh): 70cm" },
    "small-horse": { distance: 0.8, description: "Walk poles - small horse (14.3-16hh): 80cm" },
    "big-horse": { distance: 0.9, description: "Walk poles - big horse (16.1hh+): 90cm" }
  },
  "trot-poles": {
    "small-pony": { distance: 0.8, description: "Trot poles - small pony (<13hh): 80cm" },
    "big-pony": { distance: 1.0, description: "Trot poles - big pony (13-14.2hh): 1.0m" },
    "small-horse": { distance: 1.2, description: "Trot poles - small horse (14.3-16hh): 1.2m" },
    "big-horse": { distance: 1.4, description: "Trot poles - big horse (16.1hh+): 1.4m" }
  },
  "canter-poles": {
    "small-pony": { distance: 2.7, description: "Canter poles - small pony (<13hh): 2.7m" },
    "big-pony": { distance: 2.9, description: "Canter poles - big pony (13-14.2hh): 2.9m" },
    "small-horse": { distance: 3.1, description: "Canter poles - small horse (14.3-16hh): 3.1m" },
    "big-horse": { distance: 3.4, description: "Canter poles - big horse (16.1hh+): 3.4m" }
  },
  "gridwork": {
    "small-pony": { distance: 2.7, description: "Gridwork bounce - small pony (<13hh): 2.7m" },
    "big-pony": { distance: 2.9, description: "Gridwork bounce - big pony (13-14.2hh): 2.9m" },
    "small-horse": { distance: 3.1, description: "Gridwork bounce - small horse (14.3-16hh): 3.1m" },
    "big-horse": { distance: 3.4, description: "Gridwork bounce - big horse (16.1hh+): 3.4m" },
    "1-stride-small-pony": { distance: 5.4, description: "Gridwork 1 stride - small pony (<13hh): 5.4m" },
    "1-stride-big-pony": { distance: 5.8, description: "Gridwork 1 stride - big pony (13-14.2hh): 5.8m" },
    "1-stride-small-horse": { distance: 6.2, description: "Gridwork 1 stride - small horse (14.3-16hh): 6.2m" },
    "1-stride-big-horse": { distance: 6.8, description: "Gridwork 1 stride - big horse (16.1hh+): 6.8m" },
    "2-stride-small-pony": { distance: 8.1, description: "Gridwork 2 strides - small pony (<13hh): 8.1m" },
    "2-stride-big-pony": { distance: 8.7, description: "Gridwork 2 strides - big pony (13-14.2hh): 8.7m" },
    "2-stride-small-horse": { distance: 9.3, description: "Gridwork 2 strides - small horse (14.3-16hh): 9.3m" },
    "2-stride-big-horse": { distance: 10.2, description: "Gridwork 2 strides - big horse (16.1hh+): 10.2m" },
    "3-stride-small-pony": { distance: 10.8, description: "Gridwork 3 strides - small pony (<13hh): 10.8m" },
    "3-stride-big-pony": { distance: 11.6, description: "Gridwork 3 strides - big pony (13-14.2hh): 11.6m" },
    "3-stride-small-horse": { distance: 12.4, description: "Gridwork 3 strides - small horse (14.3-16hh): 12.4m" },
    "3-stride-big-horse": { distance: 13.6, description: "Gridwork 3 strides - big horse (16.1hh+): 13.6m" },
    "4-stride-small-pony": { distance: 13.5, description: "Gridwork 4 strides - small pony (<13hh): 13.5m" },
    "4-stride-big-pony": { distance: 14.5, description: "Gridwork 4 strides - big pony (13-14.2hh): 14.5m" },
    "4-stride-small-horse": { distance: 15.5, description: "Gridwork 4 strides - small horse (14.3-16hh): 15.5m" },
    "4-stride-big-horse": { distance: 17.0, description: "Gridwork 4 strides - big horse (16.1hh+): 17.0m" },
    "5-stride-small-pony": { distance: 16.2, description: "Gridwork 5 strides - small pony (<13hh): 16.2m" },
    "5-stride-big-pony": { distance: 17.4, description: "Gridwork 5 strides - big pony (13-14.2hh): 17.4m" },
    "5-stride-small-horse": { distance: 18.6, description: "Gridwork 5 strides - small horse (14.3-16hh): 18.6m" },
    "5-stride-big-horse": { distance: 20.4, description: "Gridwork 5 strides - big horse (16.1hh+): 20.4m" },
    "6-stride-small-pony": { distance: 18.9, description: "Gridwork 6 strides - small pony (<13hh): 18.9m" },
    "6-stride-big-pony": { distance: 20.3, description: "Gridwork 6 strides - big pony (13-14.2hh): 20.3m" },
    "6-stride-small-horse": { distance: 21.7, description: "Gridwork 6 strides - small horse (14.3-16hh): 21.7m" },
    "6-stride-big-horse": { distance: 23.8, description: "Gridwork 6 strides - big horse (16.1hh+): 23.8m" }
  },
  "course-distances": {
    "1-stride-small-pony": { distance: 6.5, description: "1 stride" },
    "1-stride-big-pony": { distance: 6.7, description: "1 stride" },
    "1-stride-small-horse": { distance: 6.9, description: "1 stride" },
    "1-stride-big-horse": { distance: 7.2, description: "1 stride" },
    "2-stride-small-pony": { distance: 10.0, description: "2 strides" },
    "2-stride-big-pony": { distance: 10.3, description: "2 strides" },
    "2-stride-small-horse": { distance: 10.7, description: "2 strides" },
    "2-stride-big-horse": { distance: 11.0, description: "2 strides" },
    "3-stride-small-pony": { distance: 13.0, description: "3 strides" },
    "3-stride-big-pony": { distance: 13.7, description: "3 strides" },
    "3-stride-small-horse": { distance: 14.3, description: "3 strides" },
    "3-stride-big-horse": { distance: 15.0, description: "3 strides" },
    "4-stride-small-pony": { distance: 16.5, description: "4 strides" },
    "4-stride-big-pony": { distance: 17.2, description: "4 strides" },
    "4-stride-small-horse": { distance: 17.8, description: "4 strides" },
    "4-stride-big-horse": { distance: 18.5, description: "4 strides" },
    "5-stride-small-pony": { distance: 20.0, description: "5 strides" },
    "5-stride-big-pony": { distance: 20.7, description: "5 strides" },
    "5-stride-small-horse": { distance: 21.3, description: "5 strides" },
    "5-stride-big-horse": { distance: 22.0, description: "5 strides" },
    "6-stride-small-pony": { distance: 23.5, description: "6 strides" },
    "6-stride-big-pony": { distance: 24.2, description: "6 strides" },
    "6-stride-small-horse": { distance: 24.8, description: "6 strides" },
    "6-stride-big-horse": { distance: 25.5, description: "6 strides" },
    "7-stride-small-pony": { distance: 27.0, description: "7 strides" },
    "7-stride-big-pony": { distance: 27.7, description: "7 strides" },
    "7-stride-small-horse": { distance: 28.3, description: "7 strides" },
    "7-stride-big-horse": { distance: 29.0, description: "7 strides" }
  }
} as const;

export const getStrideLength = (feet: number, inches: number): number => {
  const totalInches = (feet * 12) + inches;
  
  if (totalInches <= 60) return 25;
  if (totalInches <= 61) return 25;
  if (totalInches <= 62) return 26;
  if (totalInches <= 63) return 26;
  if (totalInches <= 64) return 26;
  if (totalInches <= 65) return 27;
  if (totalInches <= 66) return 27;
  if (totalInches <= 67) return 28;
  if (totalInches <= 68) return 28;
  if (totalInches <= 69) return 28;
  if (totalInches <= 70) return 29;
  if (totalInches <= 71) return 29;
  if (totalInches <= 72) return 30;
  if (totalInches <= 73) return 30;
  if (totalInches <= 74) return 31;
  if (totalInches <= 75) return 31;
  if (totalInches <= 76) return 31;
  if (totalInches <= 77) return 32;
  return 32;
};