import {
  BeforeCreate,
  Collection,
  Entity,
  EntityManager,
  ManyToOne,
  MikroORM,
  OneToMany,
  OnInit,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import { mikroOrmBaseRepositoryFactory } from "../mikro-orm-repository"
import { dropDatabase } from "pg-god"

@Entity()
class Entity1 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @OneToMany(() => Entity2, (entity2) => entity2.entity1, {})
  entity2 = new Collection<Entity2>(this)

  @OnInit()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }

  @BeforeCreate()
  beforeCreate() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

@Entity()
class Entity2 {
  @PrimaryKey()
  id: string

  @Property()
  title: string

  @Property({ nullable: true })
  deleted_at: Date | null

  @ManyToOne(() => Entity1, { nullable: true })
  entity1: Entity1 | null

  @OnInit()
  onInit() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }

  @BeforeCreate()
  beforeCreate() {
    if (!this.id) {
      this.id = Math.random().toString(36).substring(7)
    }
  }
}

const Entity1Repository = mikroOrmBaseRepositoryFactory<Entity1>(Entity1)
const Entity2Repository = mikroOrmBaseRepositoryFactory<Entity2>(Entity2)

describe("mikroOrmRepository", () => {
  describe("upsert", () => {
    let orm!: MikroORM
    let manager!: EntityManager

    beforeEach(async () => {
      await dropDatabase(
        { databaseName: "dogfood", errorIfNonExist: false },
        { user: "postgres" }
      )

      orm = await MikroORM.init({
        entities: [Entity1, Entity2],
        dbName: "dogfood",
        type: "postgresql",
      })

      const generator = orm.getSchemaGenerator()
      await generator.ensureDatabase()
      await generator.createSchema()

      manager = orm.em.fork()
    })

    afterEach(async () => {
      const generator = orm.getSchemaGenerator()
      await generator.dropSchema()
      await orm.close(true)
    })

    it("should successfully create a flat entity", async () => {
      const entity1Manager = new Entity1Repository({ manager })
      const entity1 = { id: "1", title: "en1" }

      const resp = await entity1Manager.upsert([entity1])
      const listedEntities = await entity1Manager.find()

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
    })

    it("should successfully update a flat entity", async () => {
      const entity1Manager = new Entity1Repository({ manager })
      const entity1 = { id: "1", title: "en1" }

      await entity1Manager.upsert([entity1])
      entity1.title = "newen1"
      await entity1Manager.upsert([entity1])
      const listedEntities = await entity1Manager.find()

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "newen1",
        })
      )
    })

    // TODO: Should we support this
    it.skip("should successfully create an entity with a sub-entity many-to-one relation", async () => {
      const entity2Manager = new Entity2Repository({ manager })
      const entity2 = {
        id: "2",
        title: "en2",
        entity1: { title: "en1" },
      }

      await entity2Manager.upsert([entity2], { relations: ["entity1"] })
      const listedEntities = await entity2Manager.find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "2",
          title: "en2",
          entity1: expect.objectContaining({
            id: expect.any(String),
            title: "en1",
          }),
        })
      )
    })

    it.skip("should only create the parent entity of a many-to-one if relation is not included", async () => {
      const entity2Manager = new Entity2Repository({ manager })
      const entity2 = {
        id: "2",
        title: "en2",
        entity1: { title: "en1" },
      }

      await entity2Manager.upsert([entity2], { relations: [] })
      const listedEntities = await entity2Manager.find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "2",
          title: "en2",
          entity1: null,
        })
      )
    })

    it.skip("should only update the parent entity of a many-to-one if relation is not included", async () => {
      const entity2Manager = new Entity2Repository({ manager })
      const entity2 = {
        id: "2",
        title: "en2",
        entity1: { title: "en1" },
      }

      await entity2Manager.upsert([entity2], { relations: ["entity1"] })

      entity2.title = "newen2"
      entity2.entity1.title = "newen1"
      await entity2Manager.upsert([entity2], { relations: [] })
      const listedEntities = await entity2Manager.find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "2",
          title: "newen2",
          entity1: expect.objectContaining({
            title: "en1",
          }),
        })
      )
    })

    it.skip("should successfully update an entity with a sub-entity many-to-one relation", async () => {
      const entity2Manager = new Entity2Repository({ manager })
      const entity2 = {
        id: "2",
        title: "en2",
        entity1: { title: "en1" },
      }

      await entity2Manager.upsert([entity2], { relations: ["entity1"] })
      entity2.title = "newen2"
      entity2.entity1!.title = "newen1"
      await entity2Manager.upsert([entity2], { relations: ["entity1"] })
      const listedEntities = await entity2Manager.find({
        where: { id: "2" },
        options: { populate: ["entity1"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "2",
          title: "newen2",
          entity1: expect.objectContaining({
            id: expect.any(String),
            title: "newen1",
          }),
        })
      )
    })

    it("should only create the parent entity of a one-to-many if relation is not included", async () => {
      const entity1Manager = new Entity1Repository({ manager })
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ title: "en2-1" }, { title: "en2-2" }],
      }

      await entity1Manager.upsert([entity1], { relations: ["entity2"] })
      const listedEntities = await entity1Manager.find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2).toHaveLength(0)
    })

    it("should successfully create an entity with a sub-entity one-to-many relation", async () => {
      const entity1Manager = new Entity1Repository({ manager })
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ title: "en2-1" }, { title: "en2-2" }],
      }

      await entity1Manager.upsert([entity1], { relations: ["entity2"] })
      const listedEntities = await entity1Manager.find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2).toHaveLength(2)
      expect(listedEntities[0].entity2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2-1",
          }),
          expect.objectContaining({
            title: "en2-2",
          }),
        ])
      )
    })

    it("should only update the parent entity of a one-to-many if relation is not included", async () => {
      const entity1Manager = new Entity1Repository({ manager })
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [{ title: "en2-1" }, { title: "en2-2" }],
      }

      await entity1Manager.upsert([entity1], { relations: ["entity2"] })
      entity1.entity2.push({ title: "en2-3" })
      await entity1Manager.upsert([entity1], { relations: [] })

      const listedEntities = await entity1Manager.find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2).toHaveLength(2)
      expect(listedEntities[0].entity2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "en2-1",
          }),
          expect.objectContaining({
            title: "en2-2",
          }),
        ])
      )
    })

    it.only("should successfully update, create, and delete subentities an entity with a one-to-many relation", async () => {
      const entity1Manager = new Entity1Repository({ manager })
      const entity1 = {
        id: "1",
        title: "en1",
        entity2: [
          { id: "2", title: "en2-1" },
          { id: "3", title: "en2-2" },
        ] as any[],
      }

      await entity1Manager.upsert([entity1], { relations: ["entity2"] })

      entity1.entity2 = [{ id: "2", title: "newen2-1" }, { title: "en2-3" }]

      await entity1Manager.upsert([entity1], { relations: ["entity2"] })
      const listedEntities = await entity1Manager.find({
        where: { id: "1" },
        options: { populate: ["entity2"] },
      })

      expect(listedEntities).toHaveLength(1)
      expect(listedEntities[0]).toEqual(
        expect.objectContaining({
          id: "1",
          title: "en1",
        })
      )
      expect(listedEntities[0].entity2).toHaveLength(2)
      expect(listedEntities[0].entity2).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: "newen2-1",
          }),
          expect.objectContaining({
            title: "en2-3",
          }),
        ])
      )
    })

    it("should only create the parent entity of a many-to-many if relation is not included", async () => {})
    it("should successfully create an entity with a sub-entity many-to-many relation", async () => {})
    it("should only update the parent entity of a many-to-many if relation is not included", async () => {})
    it("should successfully update an entity with a sub-entity many-to-many relation", async () => {})
    it("should successfully update, create, and delete subentities an entity with a many-to-many relation", async () => {})
  })
})
