class Functor {
  // fmap() {}
  async getValue(r?: any): Promise<any> {}
}
class Monad extends Functor {
  // bind() {}
  // join() {}
}

class Function$<R, M> extends Monad {
  static return<N>(n: N): Function$<void, N> {
    return new Function$(() => n);
  }
  constructor(public func: (r: R) => M) {
    super();
  }
  fmap<N>(f: (a: M) => N): Function$<R, N> {
    return new Function$((r: R) => f(this.func(r)));
  }
  bind<N>(f: (a: M) => Function$<R, N>): Function$<R, N> {
    return new Function$((r: R) => f(this.func(r)).func(r));
  }
  async getValue(r: R) {
    return getValue(r)(this.func(r));
  }
}

class Array$<M> extends Monad {
  static return<N>(m: N): Array$<N> {
    return new Array$([m]);
  }
  constructor(public array: Array<M>) {
    super();
  }
  fmap<N>(f: (m: M) => N): Array$<N> {
    return new Array$(this.array.map(f));
  }
  join(): Array$<M extends Array$<infer N> ? N : M> {
    return new Array$(
      this.array.map((a$) => (a$ instanceof Array$ ? a$.array : [a$])).flat()
    );
  }
  bind<N>(f: (m: M) => Array$<N>): Array$<N> {
    return new Array$(this.array.flatMap((x) => f(x).array));
  }
  async getValue(r: any) {
    return Promise.all(this.array.map(getValue(r)));
  }
}

class Promise$<M> extends Monad {
  static return<N>(n: N): Promise$<N> {
    return new Promise$(Promise.resolve(n));
  }
  static sequence<T>(array$: Array$<Promise$<T>>): Promise$<Array$<T>> {
    return new Promise$(
      Promise.all(array$.array.map((promise$) => promise$.promise))
    ).fmap((p) => new Array$(p));
  }
  constructor(public promise: Promise<M>) {
    super();
  }
  fmap<N>(f: (m: M) => N): Promise$<N> {
    return new Promise$(this.promise.then(f));
  }
  bind<N>(f: (m: M) => Promise$<N>): Promise$<N> {
    const g = new Function$(f).fmap((p) => p.promise).func;
    return new Promise$(this.promise.then(g));
  }
  async getValue(r: any) {
    return await this.fmap(getValue(r)).promise;
  }
}

class PromiseArray$<M> extends Monad {
  static return<N>(n: N): PromiseArray$<N> {
    return new PromiseArray$(Promise$.return(Array$.return(n)));
  }
  static returnMultiple<N>(ns: N[]): PromiseArray$<N> {
    return new PromiseArray$(Promise$.return(new Array$(ns)));
  }
  constructor(public promise$array$: Promise$<Array$<M>>) {
    super();
  }
  fmap<N>(f: (m: M) => N): PromiseArray$<N> {
    return new PromiseArray$(
      this.promise$array$.fmap((array$) => array$.fmap(f))
    );
  }
  bind<N>(f: (m: M) => PromiseArray$<N>): PromiseArray$<N> {
    return new PromiseArray$(
      this.promise$array$.bind((array$) =>
        Promise$.sequence(
          array$.fmap((m) => f(m).promise$array$)
        ).fmap((array$) => array$.join())
      )
    );
  }
  async getValue(r: any) {
    return this.promise$array$.getValue(r);
  }
}

class Query$<R extends any, M extends {}> extends Monad {
  static return<N extends {}>(n: N): Query$<void, N> {
    return new Query$(Function$.return(PromiseArray$.return(n)));
  }
  static returnMultiple<N extends {}>(ns: N[]): Query$<void, N> {
    return new Query$(Function$.return(PromiseArray$.returnMultiple(ns)));
  }
  constructor(public query$: Function$<R, PromiseArray$<M>>) {
    super();
  }
  fmap<N>(f: (m: M) => N): Query$<R, N> {
    return new Query$(
      this.query$.fmap((promise$array$) => promise$array$.fmap(f))
    );
  }
  bind<N>(f: (m: M) => Query$<R, N>): Query$<R, N> {
    return new Query$(
      new Function$((r) => this.query$.func(r).bind((m) => f(m).query$.func(r)))
    );
  }
  extend(subqueries: Record<string, Query$<M, any>>) {
    const resolveItem = async (m: M) => {
      const extension: Record<string, any> = {};
      for (const key of Object.keys(subqueries)) {
        extension[key] = await subqueries[key].query$.func(m).promise$array$
          .promise;
      }
      return {
        ...m,
        ...extension,
      };
    };
    return new Query$(
      new Function$(
        (r: R) =>
          new PromiseArray$(
            this.query$
              .func(r)
              .promise$array$.bind((array$) =>
                Promise$.sequence(
                  array$.fmap(resolveItem).fmap((p) => new Promise$(p))
                )
              )
          )
      )
    );
  }
  async getValue(r: any) {
    return this.query$.getValue(r);
  }
}

const data1 = [
  {
    name: "a",
    age: 23,
  },
  {
    name: "b",
    age: 25,
  },
  {
    name: "c",
    age: 24,
  },
];

const data2 = [
  {
    name: "a",
    test: "asdf;laksdfj;al",
    other: "ha",
  },
  {
    name: "b",
    age: 25,
    other: "hey",
  },
  {
    name: "c",
    age: 24,
    other: "ho",
  },
];

const data3 = [
  {
    age: 24,
    other: "twenty four",
  },
  {
    age: 25,
    other: "二十五",
  },
  {
    age: 23,
    other: "23232",
  },
];

const getValue = <R>(r: R) => async <T>(m: T) => {
  if (m instanceof Functor) return m.getValue(r);
  if (typeof m === "object") {
    const res = {} as Record<string, any>;
    for (const key of Object.keys(m)) {
      res[key] = await getValue(r)((m as Record<string, any>)[key]);
    }
    return res;
  }
  return m;
};

const query = Query$.returnMultiple(data1);

const query2 = new Query$(
  new Function$((root: any) =>
    PromiseArray$.returnMultiple(
      data2.filter((item) => item.name === root.name)
    )
  )
);

const query3 = new Query$(
  new Function$((root: any) =>
    PromiseArray$.returnMultiple(data3.filter((item) => item.age === root.age))
  )
);

const q = query.extend({
  a: query2,
  b: query3,
});

getValue(0)(q)
  .then((x) => JSON.stringify(x, null, 2))
  .then(console.log);

getValue(0)(q)
  .then((x) => JSON.stringify(x, null, 2))
  .then(console.log);