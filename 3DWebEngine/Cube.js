import { Shape } from "./Shape.js";
import { Matrix4f } from "./Matrix4f.js";
import { Vector3f } from "./Vector3f.js";
import { Engine } from "./Engine.js";

export class Cube extends Shape
{

    constructor(name)
    {
        super(name, 36, 36 * 3 + 36 * 4 + 36 * 2);
    }

    onLoad()
    {
        var topLeft = new Vector3f(-1, 1, 1);
        var topRight = new Vector3f(1, 1, 1);
        var downLeft = new Vector3f(-1, -1, 1);
        var downRight = new Vector3f(1, -1, 1);
        var backTopLeft = new Vector3f(-1, 1, -1);
        var backTopRight = new Vector3f(1, 1, -1);
        var backDownLeft = new Vector3f(-1, -1, -1);
        var backDownRight = new Vector3f(1, -1, -1);

        //Front
        this.vertexBuffer.appendCoordinate(topLeft);
        this.vertexBuffer.appendCoordinate(topRight);
        this.vertexBuffer.appendCoordinate(downLeft);

        this.vertexBuffer.appendCoordinate(topRight);
        this.vertexBuffer.appendCoordinate(downLeft);
        this.vertexBuffer.appendCoordinate(downRight);
        
        //Back
        this.vertexBuffer.appendCoordinate(backTopLeft);
        this.vertexBuffer.appendCoordinate(backTopRight);
        this.vertexBuffer.appendCoordinate(backDownLeft);

        this.vertexBuffer.appendCoordinate(backTopRight);
        this.vertexBuffer.appendCoordinate(backDownLeft);
        this.vertexBuffer.appendCoordinate(backDownRight);

        //Top
        this.vertexBuffer.appendCoordinate(backTopLeft);
        this.vertexBuffer.appendCoordinate(backTopRight);
        this.vertexBuffer.appendCoordinate(topLeft);
        
        this.vertexBuffer.appendCoordinate(backTopRight);
        this.vertexBuffer.appendCoordinate(topLeft);
        this.vertexBuffer.appendCoordinate(topRight);

        //Down
        this.vertexBuffer.appendCoordinate(backDownLeft);
        this.vertexBuffer.appendCoordinate(backDownRight);
        this.vertexBuffer.appendCoordinate(downLeft);
        
        this.vertexBuffer.appendCoordinate(backDownRight);
        this.vertexBuffer.appendCoordinate(downLeft);
        this.vertexBuffer.appendCoordinate(downRight);

        //Left
        this.vertexBuffer.appendCoordinate(backTopLeft);
        this.vertexBuffer.appendCoordinate(topLeft);
        this.vertexBuffer.appendCoordinate(backDownLeft);
        
        this.vertexBuffer.appendCoordinate(topLeft);
        this.vertexBuffer.appendCoordinate(backDownLeft);
        this.vertexBuffer.appendCoordinate(downLeft);

        //Right
        this.vertexBuffer.appendCoordinate(topRight);
        this.vertexBuffer.appendCoordinate(backTopRight);
        this.vertexBuffer.appendCoordinate(downRight);
        
        this.vertexBuffer.appendCoordinate(backTopRight);
        this.vertexBuffer.appendCoordinate(downRight);
        this.vertexBuffer.appendCoordinate(backDownRight);

        //Color
        this.vertexBuffer.appendColor(this.color, 36);

        //Texture coords
        this.vertexBuffer.appendTextureQuadCoordinate(6);

        this.vertexArray.load();
        this.vertexBuffer.load();

        this.vertexArray.bind();
        this.vertexBuffer.bind();
        this.vertexBuffer.configure(0, 3, 0);
        this.vertexBuffer.configure(1, 4, 36 * 3 * 4);
        this.vertexBuffer.configure(2, 2, 36 * 3 * 4 + 36 * 4 * 4);
        this.vertexArray.unbind();
    }

    onUpdateColor()
    {
        var data = [];
        for(var i = 0; i < 36; i++)
        {
            data.push(this.color.getRed());
            data.push(this.color.getGreen());
            data.push(this.color.getBlue());
            data.push(this.color.getAlpha());
        }
        this.vertexArray.bind();
        this.vertexBuffer.bind();
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 36 * 3 * 4, new Float32Array(data), 0, 0);
        this.vertexArray.unbind();
    }

    onDraw()
    {
        var renderer = Engine.getInstance().getRenderer();
        var level = Engine.getInstance().getLevel();
        
        this.shader.bind();
        this.shader.sendMatrix4fData("projection.projectionMatrix", Matrix4f.projectionMatrix(renderer.getWidth(), renderer.getHeight(), 60, 0.1, 1000));
        this.shader.sendMatrix4fData("model.scaleMatrix", Matrix4f.scaleMatrix(this.scale));
        this.shader.sendMatrix4fData("model.translationMatrix", Matrix4f.translationMatrix(this.position));
        this.shader.sendMatrix4fData("model.rotationXMatrix", Matrix4f.rotationXMatrix(this.rotation.getX()));
        this.shader.sendMatrix4fData("model.rotationYMatrix", Matrix4f.rotationYMatrix(this.rotation.getY()));
        this.shader.sendMatrix4fData("model.rotationZMatrix", Matrix4f.rotationZMatrix(this.rotation.getZ()));

        if(this.isFollowingCamera() == false)
        {
            this.shader.sendMatrix4fData("view.translationMatrix", Matrix4f.viewTranslationMatrix(level.getCamera().getPosition()));
            this.shader.sendMatrix4fData("view.rotationXMatrix", Matrix4f.rotationXMatrix(level.getCamera().getRotation().getX()));
            this.shader.sendMatrix4fData("view.rotationYMatrix", Matrix4f.rotationYMatrix(level.getCamera().getRotation().getY()));
            this.shader.sendMatrix4fData("view.rotationZMatrix", Matrix4f.rotationZMatrix(level.getCamera().getRotation().getZ()));
        } else {
            this.shader.sendMatrix4fData("view.translationMatrix", Matrix4f.identity());
            this.shader.sendMatrix4fData("view.rotationXMatrix", Matrix4f.identity());
            this.shader.sendMatrix4fData("view.rotationYMatrix", Matrix4f.identity());
            this.shader.sendMatrix4fData("view.rotationZMatrix", Matrix4f.identity());
        }
        
        this.shader.sendBoolData("shape.hasColor", true);

        if(this.color != null)
        {
            this.shader.sendBoolData("shape.hasColor", true);
        } else {
            this.shader.sendBoolData("shape.hasColor", false);
        }
        
        if(this.texture != null)
        {
            this.shader.sendBoolData("shape.hasTexture", true);
        } else {
            this.shader.sendBoolData("shape.hasTexture", false);
        }

        if(this.texture != null) this.texture.bind();
        this.vertexArray.bind();
        this.vertexBuffer.draw();
        this.vertexArray.unbind();
        if(this.texture != null) this.texture.unbind();
    }

    onUnload()
    {
        this.vertexBuffer.unload();
        this.vertexArray.unload();
    }

    onUpdateTexture() {}

}