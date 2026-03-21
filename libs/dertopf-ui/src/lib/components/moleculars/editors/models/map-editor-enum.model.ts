import * as Cesium from 'cesium';

export enum EditMode {
  DEFAULT = 'DEFAULT',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
}

export interface EditPointData {
  index: number;
  isVirtual: boolean;
  entityId: string;
}

export type EditorEntity = Cesium.Entity & { _editData?: EditPointData };
