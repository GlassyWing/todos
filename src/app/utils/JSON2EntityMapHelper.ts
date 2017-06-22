export class JSON2EntityMapHelper {

  public static convertToEntity<T>(json: any): T {
    return <T> Object.assign(json);
  }

  public static convertToJson(entity: any): string {
    return JSON.stringify(entity);
  }

}
