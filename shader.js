class Shader {
  
}

class DiffuseShader {
  constructor(diffuseColor) {
    this.diffuseColor = diffuseColor;
  }
  illuminateObject(rayFrom, rayCollision, normal, collisionObject) {

    let inShadow = false;

    //Manually check for shadows
    for (let object of Scene.scene.rayTracedObjects) {
      if (object == collisionObject) continue
      let directionToLight = Scene.scene.lights[0].direction.normalize()

      let collision = object.geometry.intersect(rayCollision, directionToLight)
      if (collision) {
        inShadow = true;
        break;
      }
    }

    let dot = normal.dot(Scene.scene.lights[0].direction.normalize());
    if(inShadow) dot = 0;
    if (dot <= 0)
      dot = 0
    return { r: this.diffuseColor.r * dot, g: this.diffuseColor.g * dot, b: this.diffuseColor.b * dot };
  }
}

class AmbientShader{
  constructor(ambientColor) {
    this.ambientColor = ambientColor;
  }
  illuminateObject(rayFrom, rayCollision, normal, collisionObject) {
    return this.ambientColor;
  }

}

class MixShader{
  constructor(one, two, amount){
    this.one = one;
    this.two = two;
    this.amount = amount;
  }
  illuminateObject(rayFrom, rayCollision, normal, collisionObject) {
    let tempOne = this.one.illuminateObject(rayFrom, rayCollision, normal, collisionObject)
    let tempTwo = this.two.illuminateObject(rayFrom, rayCollision, normal, collisionObject)
    return {
      r:this.amount*tempOne.r + (1-this.amount)*tempTwo.r,
      g:this.amount*tempOne.g + (1-this.amount)*tempTwo.g,
      b:this.amount*tempOne.b + (1-this.amount)*tempTwo.b
    }
  }

}

