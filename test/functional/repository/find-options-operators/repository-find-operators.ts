import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../../utils/test-utils";
import {
    Any,
    Between,
    Connection,
    Equal,
    If,
    In,
    IsNull,
    LessThan,
    Like,
    MoreThan,
    Not,
    Raw,
    Switch
} from "../../../../src";
import {Post} from "./entity/Post";
import {PostgresDriver} from "../../../../src/driver/postgres/PostgresDriver";

describe.only("repository > find options > operators", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        enabledDrivers: ["mysql"]
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("not", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not("About #1")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("lessThan", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: LessThan(10)
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(lessThan)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(LessThan(10))
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("moreThan", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: MoreThan(10)
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("not(moreThan)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Not(MoreThan(10))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("equal", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Equal("About #2")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(equal)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(Equal("About #2"))
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("like", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Like("%out #%")
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }, { id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(like)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(Like("%out #1"))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("between", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts1 = await connection.getRepository(Post).find({
            likes: Between(1, 10)
        });
        loadedPosts1.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

        const loadedPosts2 = await connection.getRepository(Post).find({
            likes: Between(10, 13)
        });
        loadedPosts2.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

        const loadedPosts3 = await connection.getRepository(Post).find({
            likes: Between(1, 20)
        });
        loadedPosts3.should.be.eql([{ id: 1, likes: 12, title: "About #1" }, { id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(between)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts1 = await connection.getRepository(Post).find({
            likes: Not(Between(1, 10))
        });
        loadedPosts1.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

        const loadedPosts2 = await connection.getRepository(Post).find({
            likes: Not(Between(10, 13))
        });
        loadedPosts2.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

        const loadedPosts3 = await connection.getRepository(Post).find({
            likes: Not(Between(1, 20))
        });
        loadedPosts3.should.be.eql([]);
    })));

    it("in", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: In(["About #2", "About #3"])
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(in)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(In(["About #1", "About #3"]))
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("any", () => Promise.all(connections.map(async connection => {
        if (!(connection.driver instanceof PostgresDriver))
            return;

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Any(["About #2", "About #3"])
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("not(any)", () => Promise.all(connections.map(async connection => {
        if (!(connection.driver instanceof PostgresDriver))
            return;

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(Any(["About #2", "About #3"]))
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("isNull", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = null as any;
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: IsNull()
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: null }]);

    })));

    it("not(isNull)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = null as any;
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: Not(IsNull())
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("raw", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Raw("12")
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("raw (function)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            likes: Raw(columnAlias => "1 + " + columnAlias + " = 4")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("if (true)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: If(10 === (5 + 5), "About #1")
        });
        loadedPosts.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

    })));

    it("if (false)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: If(9 === (5 + 5), "About #1")
        });
        loadedPosts.length.should.be.eql(2);

    })));

    it("if (else)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: If(9 === (5 + 5), "About #1", "About #2")
        });
        loadedPosts.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

    })));

    it("if (operator)", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        // check operator
        const loadedPosts = await connection.getRepository(Post).find({
            title: If(10 === (5 + 5), Like("About #%"))
        });
        loadedPosts.length.should.be.eql(2);

    })));

    it("switch", () => Promise.all(connections.map(async connection => {

        // insert some fake data
        const post1 = new Post();
        post1.title = "About #1";
        post1.likes = 12;
        await connection.manager.save(post1);
        const post2 = new Post();
        post2.title = "About #2";
        post2.likes = 3;
        await connection.manager.save(post2);

        const value1: "one"|"two"|"three"|"four"|"five"|"move than five"|"less that five" = "two";
        const loadedPosts1 = await connection.getRepository(Post).find({
            likes: Switch(value1, {
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4,
                "five": 5,
                "move than five": MoreThan(5),
                "less that five": Not(MoreThan(5)),
            })
        });
        loadedPosts1.length.should.be.equal(0);

        const value2: "one"|"two"|"three"|"four"|"five"|"move than five"|"less that five" = "three";
        const loadedPosts2 = await connection.getRepository(Post).find({
            likes: Switch(value2, {
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4,
                "five": 5,
                "move than five": MoreThan(5),
                "less that five": Not(MoreThan(5)),
            })
        });
        loadedPosts2.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

        const value3: "one"|"two"|"three"|"four"|"five"|"move than five"|"less that five" = "move than five";
        const loadedPosts3 = await connection.getRepository(Post).find({
            likes: Switch(value3, {
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4,
                "five": 5,
                "move than five": MoreThan(5),
                "less that five": Not(MoreThan(5)),
            })
        });
        loadedPosts3.should.be.eql([{ id: 1, likes: 12, title: "About #1" }]);

        const value4: "one"|"two"|"three"|"four"|"five"|"move than five"|"less that five" = "less that five";
        const loadedPosts4 = await connection.getRepository(Post).find({
            likes: Switch(value4, {
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4,
                "five": 5,
                "move than five": MoreThan(5),
                "less that five": Not(MoreThan(5)),
            })
        });
        loadedPosts4.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

        const value5: "one"|"two"|"three"|"four"|"five"|"move than five"|"less that five"|"something else" = "something else";
        const loadedPosts5 = await connection.getRepository(Post).find({
            likes: Switch(value5, {
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4,
                "five": 5,
                "move than five": MoreThan(5),
                "less that five": Not(MoreThan(5)),
                "_": 3
            })
        });
        loadedPosts5.should.be.eql([{ id: 2, likes: 3, title: "About #2" }]);

        const value6: "one"|"two"|"three"|"four"|"five"|"move than five"|"less that five"|"something else" = "something else";
        const loadedPosts6 = await connection.getRepository(Post).find({
            likes: Switch(value6, {
                "one": 1,
                "two": 2,
                "three": 3,
                "four": 4,
                "five": 5,
                "move than five": MoreThan(5),
                "less that five": Not(MoreThan(5))
            })
        });
        loadedPosts6.length.should.be.equal(2);

    })));

});