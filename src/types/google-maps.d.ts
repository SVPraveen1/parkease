// Type definitions for Google Maps JavaScript API
declare interface Window {
  google: typeof google;
  initMap: () => void;
}

declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element, opts?: MapOptions);
    setCenter(latLng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
    setOptions(options: MapOptions): void;
    panTo(latLng: LatLng | LatLngLiteral): void;
    panBy(x: number, y: number): void;
    getCenter(): LatLng;
    getZoom(): number;
    addListener(event: string, handler: Function): MapsEventListener;
    fitBounds(bounds: LatLngBounds): void;
  }

  interface MapMouseEvent {
    latLng: LatLng;
  }

  const Animation: {
    BOUNCE: number;
    DROP: number;
  };

  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(latLng: LatLng | LatLngLiteral): void;
    getPosition(): LatLng;
    addListener(event: string, handler: Function): MapsEventListener;
  }
  
  class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    open(map?: Map, anchor?: Marker): void;
    close(): void;
    setContent(content: string | Element): void;
  }
  
  interface MapsEventListener {
    remove(): void;
  }
  
  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
  
  class LatLng {
    constructor(lat: number, lng: number, noWrap?: boolean);
    lat(): number;
    lng(): number;
  }
  
  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    clickableIcons?: boolean;
    disableDefaultUI?: boolean;
    disableDoubleClickZoom?: boolean;
    draggable?: boolean;
    draggableCursor?: string;
    fullscreenControl?: boolean;
    gestureHandling?: string;
    heading?: number;
    keyboardShortcuts?: boolean;
    mapTypeControl?: boolean;
    mapTypeId?: string;
    maxZoom?: number;
    minZoom?: number;
    noClear?: boolean;
    rotateControl?: boolean;
    scaleControl?: boolean;
    scrollwheel?: boolean;
    streetViewControl?: boolean;
    styles?: any[];
    tilt?: number;
    zoom?: number;
    zoomControl?: boolean;
  }
  
  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map;
    title?: string;
    icon?: string | Icon | Symbol;
    label?: string | MarkerLabel;
    draggable?: boolean;
    clickable?: boolean;
    animation?: any;
  }
  
  interface InfoWindowOptions {
    content?: string | Element;
    disableAutoPan?: boolean;
    maxWidth?: number;
    pixelOffset?: Size;
    position?: LatLng | LatLngLiteral;
    zIndex?: number;
  }
  
  interface MarkerLabel {
    color: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    text: string;
  }
  
  interface Icon {
    url: string;
    size?: Size;
    scaledSize?: Size;
    origin?: Point;
    anchor?: Point;
    labelOrigin?: Point;
  }
  
  class Size {
    constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
    width: number;
    height: number;
    equals(other: Size): boolean;
    toString(): string;
  }
  
  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
    equals(other: Point): boolean;
    toString(): string;
  }
  
  interface Symbol {
    path: string | SymbolPath;
    fillColor?: string;
    fillOpacity?: number;
    scale?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
  }
  
  enum SymbolPath {
    CIRCLE,
    BACKWARD_CLOSED_ARROW,
    FORWARD_CLOSED_ARROW,
    BACKWARD_OPEN_ARROW,
    FORWARD_OPEN_ARROW
  }
  
  namespace places {
    class PlacesService {
      constructor(attrContainer: Map | Element);
      nearbySearch(request: PlacesSearchRequest, callback: (results: Array<PlaceResult> | null, status: PlacesServiceStatus, pagination: PlaceSearchPagination | null) => void): void;
      getDetails(request: PlaceDetailsRequest, callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void): void;
    }
    
    interface PlacesSearchRequest {
      bounds?: LatLngBounds;
      location?: LatLng | LatLngLiteral;
      radius?: number;
      type?: string;
      keyword?: string;
      name?: string;
    }
    
    interface PlaceDetailsRequest {
      placeId: string;
      fields?: string[];
    }
    
    interface PlaceResult {
      geometry?: {
        location: LatLng;
        viewport?: LatLngBounds;
      };
      name?: string;
      place_id?: string;
      vicinity?: string;
      formatted_address?: string;
      icon?: string;
      types?: string[];
      rating?: number;
    }
    
    interface PlaceSearchPagination {
      hasNextPage: boolean;
      nextPage(): void;
    }
    
    enum PlacesServiceStatus {
      OK,
      ZERO_RESULTS,
      OVER_QUERY_LIMIT,
      REQUEST_DENIED,
      INVALID_REQUEST,
      UNKNOWN_ERROR,
      NOT_FOUND
    }
  }
  
  class LatLngBounds {
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
    extend(point: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    isEmpty(): boolean;
    contains(latLng: LatLng | LatLngLiteral): boolean;
  }
}
