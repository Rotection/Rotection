// Roblox API service for fetching game data and thumbnails
export interface RobloxGameInfo {
  id: number;
  name: string;
  description: string;
  creator: {
    id: number;
    name: string;
    type: string;
  };
  rootPlace: {
    id: number;
  };
  placeVisits: number;
  maxPlayers: number;
  playing: number;
  visits: number;
  favoritedCount: number;
  created: string;
  updated: string;
  studioAccessToApisAllowed: boolean;
  createVipServersAllowed: boolean;
  universeAvatarType: string;
  genre: string;
  isAllGenre: boolean;
  isFavoritedByUser: boolean;
  favoritedCount: number;
}

export interface RobloxThumbnail {
  targetId: number;
  state: string;
  imageUrl: string;
}

export interface RobloxGameThumbnails {
  data: RobloxThumbnail[];
}

export class RobloxApiService {
  private static readonly BASE_URL = 'https://games.roblox.com';
  private static readonly THUMBNAILS_URL = 'https://thumbnails.roblox.com';
  private static readonly CORS_PROXY = 'https://api.allorigins.win/raw?url=';

  /**
   * Extract game ID from Roblox URL
   */
  static extractGameId(url: string): string | null {
    try {
      // Handle various Roblox URL formats:
      // https://www.roblox.com/games/123456789/game-name
      // https://roblox.com/games/123456789
      // roblox.com/games/123456789/game-name
      const gameIdMatch = url.match(/games\/(\d+)/);
      if (gameIdMatch) {
        return gameIdMatch[1];
      }

      // Handle place URLs:
      // https://www.roblox.com/games/refer?PlaceId=123456789
      const placeIdMatch = url.match(/PlaceId=(\d+)/);
      if (placeIdMatch) {
        return placeIdMatch[1];
      }

      return null;
    } catch (error) {
      console.error('Error extracting game ID from URL:', error);
      return null;
    }
  }

  /**
   * Fetch game information from Roblox API
   */
  static async fetchGameInfo(gameId: string): Promise<RobloxGameInfo | null> {
    try {
      // Use universe ID to get game details
      const universeResponse = await fetch(
        `${this.CORS_PROXY}${encodeURIComponent(
          `${this.BASE_URL}/v1/games/multiget-place-details?placeIds=${gameId}`
        )}`
      );

      if (!universeResponse.ok) {
        throw new Error(`Failed to fetch universe data: ${universeResponse.status}`);
      }

      const universeData = await universeResponse.json();

      if (!universeData || universeData.length === 0) {
        throw new Error('No game data found');
      }

      const placeData = universeData[0];
      const universeId = placeData.universeId;

      // Now get detailed game info using universe ID
      const gameResponse = await fetch(
        `${this.CORS_PROXY}${encodeURIComponent(
          `${this.BASE_URL}/v1/games?universeIds=${universeId}`
        )}`
      );

      if (!gameResponse.ok) {
        throw new Error(`Failed to fetch game data: ${gameResponse.status}`);
      }

      const gameData = await gameResponse.json();

      if (!gameData.data || gameData.data.length === 0) {
        throw new Error('No detailed game data found');
      }

      const game = gameData.data[0];

      return {
        id: parseInt(gameId),
        name: game.name || placeData.name || 'Unknown Game',
        description: game.description || placeData.description || '',
        creator: game.creator || {
          id: placeData.builder?.id || 0,
          name: placeData.builder?.name || 'Unknown Creator',
          type: placeData.builder?.type || 'User'
        },
        rootPlace: {
          id: parseInt(gameId)
        },
        placeVisits: placeData.placeVisits || 0,
        maxPlayers: game.maxPlayers || placeData.maxPlayers || 0,
        playing: game.playing || 0,
        visits: game.visits || placeData.placeVisits || 0,
        favoritedCount: game.favoritedCount || 0,
        created: game.created || placeData.created || new Date().toISOString(),
        updated: game.updated || placeData.updated || new Date().toISOString(),
        studioAccessToApisAllowed: game.studioAccessToApisAllowed || false,
        createVipServersAllowed: game.createVipServersAllowed || false,
        universeAvatarType: game.universeAvatarType || 'MorphToR6',
        genre: game.genre || this.inferGenreFromName(game.name || ''),
        isAllGenre: game.isAllGenre || false,
        isFavoritedByUser: game.isFavoritedByUser || false
      };
    } catch (error) {
      console.error('Error fetching game info:', error);
      return null;
    }
  }

  /**
   * Fetch game thumbnail from Roblox thumbnails API
   */
  static async fetchGameThumbnail(gameId: string, size: string = '768x432'): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.CORS_PROXY}${encodeURIComponent(
          `${this.THUMBNAILS_URL}/v1/games/icons?universeIds=${gameId}&returnPolicy=PlaceHolder&size=${size}&format=Png&isCircular=false`
        )}`
      );

      if (!response.ok) {
        // Try with place ID if universe ID fails
        const placeResponse = await fetch(
          `${this.CORS_PROXY}${encodeURIComponent(
            `${this.THUMBNAILS_URL}/v1/places/gameicons?placeIds=${gameId}&returnPolicy=PlaceHolder&size=${size}&format=Png&isCircular=false`
          )}`
        );

        if (!placeResponse.ok) {
          throw new Error(`Failed to fetch thumbnail: ${response.status}`);
        }

        const placeData: RobloxGameThumbnails = await placeResponse.json();

        if (placeData.data && placeData.data.length > 0) {
          return placeData.data[0].imageUrl;
        }

        throw new Error('No thumbnail data found');
      }

      const data: RobloxGameThumbnails = await response.json();

      if (data.data && data.data.length > 0 && data.data[0].imageUrl) {
        return data.data[0].imageUrl;
      }

      // Fallback: return a placeholder image
      return `https://tr.rbxcdn.com/180DAY-${Math.random().toString(36).substr(2, 32)}/${size}/Image/Webp/noFilter`;
    } catch (error) {
      console.error('Error fetching game thumbnail:', error);

      // Return a fallback placeholder image
      return `https://via.placeholder.com/${size.replace('x', 'x')}/cccccc/666666?text=No+Image`;
    }
  }

  /**
   * Get game data with thumbnail
   */
  static async getGameData(gameUrl: string): Promise<{
    gameInfo: RobloxGameInfo | null;
    thumbnail: string | null;
    gameId: string | null;
  }> {
    const gameId = this.extractGameId(gameUrl);

    if (!gameId) {
      return {
        gameInfo: null,
        thumbnail: null,
        gameId: null
      };
    }

    try {
      const [gameInfo, thumbnail] = await Promise.all([
        this.fetchGameInfo(gameId),
        this.fetchGameThumbnail(gameId)
      ]);

      return {
        gameInfo,
        thumbnail,
        gameId
      };
    } catch (error) {
      console.error('Error getting game data:', error);
      return {
        gameInfo: null,
        thumbnail: null,
        gameId
      };
    }
  }

  /**
   * Validate if URL is a valid Roblox game URL
   */
  static isValidRobloxUrl(url: string): boolean {
    try {
      const gameId = this.extractGameId(url);
      return gameId !== null && /^\d+$/.test(gameId);
    } catch (error) {
      return false;
    }
  }

  /**
   * Format visit count for display
   */
  static formatVisitCount(visits: number): string {
    if (visits >= 1000000000) {
      return (visits / 1000000000).toFixed(1) + 'B+';
    } else if (visits >= 1000000) {
      return (visits / 1000000).toFixed(1) + 'M+';
    } else if (visits >= 1000) {
      return (visits / 1000).toFixed(1) + 'K+';
    } else {
      return visits.toString();
    }
  }

  /**
   * Infer genre from game name (basic implementation)
   */
  private static inferGenreFromName(name: string): string {
    const nameLower = name.toLowerCase();

    if (nameLower.includes('simulator') || nameLower.includes('sim')) {
      return 'Simulator';
    } else if (nameLower.includes('tycoon')) {
      return 'Tycoon';
    } else if (nameLower.includes('obby') || nameLower.includes('obstacle')) {
      return 'Obby';
    } else if (nameLower.includes('roleplay') || nameLower.includes('rp')) {
      return 'Roleplay';
    } else if (nameLower.includes('horror') || nameLower.includes('scary')) {
      return 'Horror';
    } else if (nameLower.includes('racing') || nameLower.includes('car')) {
      return 'Racing';
    } else if (nameLower.includes('fighting') || nameLower.includes('battle')) {
      return 'Fighting';
    } else if (nameLower.includes('adventure')) {
      return 'Adventure';
    } else if (nameLower.includes('puzzle')) {
      return 'Puzzle';
    } else if (nameLower.includes('strategy')) {
      return 'Strategy';
    } else {
      return 'All Genres';
    }
  }

  /**
   * Get age rating based on game info
   */
  static getAgeRating(gameInfo: RobloxGameInfo): string {
    const nameLower = gameInfo.name.toLowerCase();
    const descLower = gameInfo.description.toLowerCase();

    // Check for content that might indicate higher age ratings
    const matureKeywords = ['blood', 'violence', 'weapon', 'gun', 'war', 'death', 'kill'];
    const teenKeywords = ['dating', 'romance', 'chat', 'social', 'competitive'];

    const hasMatureContent = matureKeywords.some(keyword =>
      nameLower.includes(keyword) || descLower.includes(keyword)
    );

    const hasTeenContent = teenKeywords.some(keyword =>
      nameLower.includes(keyword) || descLower.includes(keyword)
    );

    if (hasMatureContent) {
      return '13+';
    } else if (hasTeenContent) {
      return '9+';
    } else {
      return '5+';
    }
  }

  /**
   * Clean and format game description
   */
  static formatDescription(description: string): string {
    if (!description) return '';

    // Remove excessive newlines and whitespace
    let cleaned = description.replace(/\n{3,}/g, '\n\n').trim();

    // Limit length for display
    if (cleaned.length > 500) {
      cleaned = cleaned.substring(0, 497) + '...';
    }

    return cleaned;
  }

  /**
   * Generate Roblox game URL from ID
   */
  static generateGameUrl(gameId: string, gameName?: string): string {
    const baseUrl = `https://www.roblox.com/games/${gameId}`;

    if (gameName) {
      // Convert name to URL-friendly format
      const urlFriendlyName = gameName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      return `${baseUrl}/${urlFriendlyName}`;
    }

    return baseUrl;
  }
}

export default RobloxApiService;
