
export type Country = {
    _id: number;
    name: string;
};

export type Swell = {
    components: {
        combined: {
            isOffshore: boolean,
            compassDirection: string,
            power: number
        },
        primary: {},
        secondary: {}
    },
    maxBreakingHeight: number,
    minBreakingHeight: number,
    period: number,
    unit: string
};

export type Tide = {
    shift: number,
    state: string,
    timestamp: number
};

export interface SpotI {
    _id: number;
    _country: number;
    name: string;
}

export type Forecast = {
    swell: Swell
};

export type Condition = {
    tide: Tide[]
};

export type EnvironmentData = {
    condition: Condition[],
    forecast: Forecast[]
};


export type Environment = {
    [key: number]: EnvironmentData
};

type Meta = {
    lat: number,
    lon: number
}

export class Spot implements SpotI {
    _id: number;
    _country: number;
    name: string;

    meta: Meta;
    favourite?: boolean;

    condition: Condition[] = [];
    forecast: Forecast[] = [];

    todayCondition: Condition;
    todayForecast: Forecast;

    constructor() {};

    public setEnvironment(data: EnvironmentData): void {
        if (data.condition) {
            this.condition = data.condition;
            this.todayCondition = data.condition[0];
        }
        if (data.forecast) {
            this.forecast = data.forecast;
            this.todayForecast = data.forecast[0];
        }
    }
}