/**
 * Chandigarh University AIT-CSE (D-Blocks) Campus Proximity Calculator for RoomRadar
 */

// Relative walking distance graph between Chandigarh University AIT D-blocks (in relative meters)
const campusBuildingDistances = {
  'Block D1': { 'Block D1': 0, 'Block D2': 12, 'Block D3': 25, 'Block D4': 35, 'Central Library': 45, 'Student Care (SCD)': 50 },
  'Block D2': { 'Block D1': 12, 'Block D2': 0, 'Block D3': 15, 'Block D4': 25, 'Central Library': 40, 'Student Care (SCD)': 45 },
  'Block D3': { 'Block D1': 25, 'Block D2': 15, 'Block D3': 0, 'Block D4': 15, 'Central Library': 35, 'Student Care (SCD)': 40 },
  'Block D4': { 'Block D1': 35, 'Block D2': 25, 'Block D3': 15, 'Block D4': 0, 'Central Library': 45, 'Student Care (SCD)': 55 },
  'Central Library': { 'Block D1': 45, 'Block D2': 40, 'Block D3': 35, 'Block D4': 45, 'Central Library': 0, 'Student Care (SCD)': 25 },
  'Student Care (SCD)': { 'Block D1': 50, 'Block D2': 45, 'Block D3': 40, 'Block D4': 55, 'Central Library': 25, 'Student Care (SCD)': 0 }
};

function getBuildingDistance(fromBuilding, toBuilding) {
  if (fromBuilding === toBuilding) return 0;
  if (campusBuildingDistances[fromBuilding] && campusBuildingDistances[fromBuilding][toBuilding] !== undefined) {
    return campusBuildingDistances[fromBuilding][toBuilding];
  }
  return 35; // Default cross-block walking distance
}

function calculateProximity(userBuilding, userFloor, rooms, targetDay = null, targetTime = null) {
  const parsedUserFloor = parseInt(userFloor, 10) || 0;

  const rankedRooms = rooms.map(room => {
    const vacancyInfo = room.checkCurrentVacancy ? room.checkCurrentVacancy(targetDay, targetTime) : { isVacant: true };
    const bDist = getBuildingDistance(userBuilding, room.building);
    const floorDiff = Math.abs(room.floor - parsedUserFloor);
    const verticalPenalty = floorDiff * 10;
    const distanceScore = bDist + verticalPenalty;

    let proximityLabel = '';
    if (bDist === 0) {
      if (floorDiff === 0) {
        proximityLabel = 'On this floor';
      } else if (room.floor > parsedUserFloor) {
        proximityLabel = `${floorDiff} ${floorDiff === 1 ? 'floor' : 'floors'} up`;
      } else {
        proximityLabel = `${floorDiff} ${floorDiff === 1 ? 'floor' : 'floors'} down`;
      }
    } else {
      proximityLabel = `In ${room.building} (Floor ${room.floor})`;
    }

    return {
      _id: room._id,
      roomNumber: room.roomNumber,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      type: room.type,
      isVacant: vacancyInfo.isVacant,
      activeClass: vacancyInfo.activeClass,
      distanceScore,
      proximityLabel,
      statusOverride: room.statusOverride
    };
  });

  // Sort by vacancy first (vacant rooms first), then by distanceScore ascending
  rankedRooms.sort((a, b) => {
    if (a.isVacant && !b.isVacant) return -1;
    if (!a.isVacant && b.isVacant) return 1;
    return a.distanceScore - b.distanceScore;
  });

  return rankedRooms;
}

module.exports = {
  calculateProximity,
  getBuildingDistance
};
