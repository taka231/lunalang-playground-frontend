"use client";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import { useState } from "react";
import { useQuery } from "react-query";

export default function Home() {
  const [code, setCode] = useState(example("Hello World"));
  const { data, isLoading, error, refetch } = useQuery(
    code,
    async () => {
      const result_json = await fetch("/api/playground", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ program: code }),
      });
      return await result_json.json();
    },
    {
      enabled: false,
    }
  );
  return (
    <div className="mx-8 my-4 space-y-2">
      <div className="flex">
        <h1 className="text-3xl font-bold">lunalang playground</h1>
        <div className="flex ml-auto space-x-4">
          <button
            className="bg-slate-700 text-cyan-500 font-semibold py-1 px-4 border border-cyan-500 rounded"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Run
          </button>
          <div>
            <select
              className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
              onChange={(e) => {
                setCode(example(e.target.value as Select));
              }}
            >
              <option>Hello World</option>
              <option>Fizzbuzz</option>
              <option>Slow Fibonacci</option>
              <option>Fast Fibonacci</option>
              <option>Algebraic Data Types(List)</option>
            </select>
          </div>
        </div>
      </div>
      <AceEditor
        mode="javascript"
        theme="monokai"
        width="100%"
        readOnly={false}
        minLines={30}
        maxLines={30}
        fontSize={16}
        enableBasicAutocompletion={false}
        value={code}
        onChange={setCode}
      />
      <div>
        <div className="bg-zinc-800 h-80 p-2 overflow-auto">
          {data ? (
            <>
              <div className="text-xl whitespace-pre-wrap">{data.stdout}</div>
              {data.error ? (
                <div className="text-red-500 text-xl">{data.error}</div>
              ) : (
                <div className="text-xl text-amber-50">
                  result: {data.result}
                </div>
              )}
            </>
          ) : isLoading ? (
            <div className="text-xl text-amber-50">Loading...</div>
          ) : error ? (
            <div className="text-xl">internal error</div>
          ) : (
            <div className="text-xl text-amber-50">Run to see result</div>
          )}
        </div>
      </div>
    </div>
  );
}

type Select =
  | "Hello World"
  | "Fizzbuzz"
  | "Slow Fibonacci"
  | "Fast Fibonacci"
  | "Algebraic Data Types(List)";

function example(select: Select): string {
  if (select === "Hello World") {
    return `let main = print("Hello World!");`;
  } else if (select == "Fizzbuzz") {
    return `let fizzbuzz(n) = 
    if (n % 15 == 0) "fizzbuzz"
    else if (n % 3 == 0) "fizz"
    else if (n % 5 == 0) "buzz"
    else n.int_to_string;

let main = for (i in [1..=100]) {
    fizzbuzz(i).println;
};`;
  } else if (select == "Slow Fibonacci") {
    return `let fib(n) = n match {
    1 => 1,
    2 => 1,
    n => fib(n-1) + fib(n-2)
};

let main = fib(10);`;
  } else if (select == "Fast Fibonacci") {
    return `let fib(n) = {
    let result = &1;
    let prev_result = &1;
    for (i in [3..=n]) {
        let tmp = *result;
        result := *result + *prev_result;
        prev_result := tmp;
    };
    *result;
};

let main = fib(50);`;
  } else {
    return `enum IntList {
  Nil,
  Cons(Int, IntList)
};

let map(f, list) = list match {
  Cons(x, xs) => Cons(f(x), map(f, xs)),
  Nil => Nil
};

let filter(f, list) = list match {
  Cons(x, xs) => if (f(x)) Cons(x, filter(f, xs)) else filter(f, xs),
  Nil => Nil
};

let foldr(f, init, list) = list match {
  Cons(x, xs) => f(x, foldr(f, init, xs)),
  Nil => init
};

let list = Cons(4, Cons(3, Cons(2, Cons(1, Nil))));

let main = list.filter(fn x -> x % 2 == 0).map(fn x -> x*x).foldr(fn x, y -> x + y, 0);`;
  }
}
