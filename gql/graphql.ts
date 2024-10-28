/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
}

export type Ingredient = {
  __typename?: 'Ingredient'
  id?: Maybe<Scalars['ID']['output']>
  name?: Maybe<Scalars['String']['output']>
  quantity?: Maybe<Scalars['Float']['output']>
  recipeId?: Maybe<Scalars['ID']['output']>
  unit?: Maybe<Scalars['String']['output']>
}

export type Method = {
  __typename?: 'Method'
  id?: Maybe<Scalars['ID']['output']>
  recipeId?: Maybe<Scalars['ID']['output']>
  step?: Maybe<Scalars['String']['output']>
  stepTime?: Maybe<Scalars['Int']['output']>
}

export type Mutation = {
  __typename?: 'Mutation'
}

export type Query = {
  __typename?: 'Query'
  recipe?: Maybe<Recipe>
  recipes?: Maybe<Array<Recipe>>
}

export type QueryRecipeArgs = {
  id: Scalars['ID']['input']
}

export type QueryRecipesArgs = {
  searchString?: InputMaybe<Scalars['String']['input']>
}

export type Recipe = {
  __typename?: 'Recipe'
  id?: Maybe<Scalars['ID']['output']>
  ingredients?: Maybe<Array<Ingredient>>
  methods?: Maybe<Array<Method>>
  name?: Maybe<Scalars['String']['output']>
}

export type MyQueryQueryVariables = Exact<{ [key: string]: never }>

export type MyQueryQuery = { __typename?: 'Query'; recipes?: Array<{ __typename?: 'Recipe'; id?: string | null; name?: string | null }> | null }

export class TypedDocumentString<TResult, TVariables> extends String implements DocumentTypeDecoration<TResult, TVariables> {
  __apiType?: DocumentTypeDecoration<TResult, TVariables>['__apiType']

  constructor(
    private value: string,
    public __meta__?: Record<string, any> | undefined
  ) {
    super(value)
  }

  toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value
  }
}

export const MyQueryDocument = new TypedDocumentString(`
    query MyQuery {
  recipes {
    id
    name
  }
}
    `) as unknown as TypedDocumentString<MyQueryQuery, MyQueryQueryVariables>
