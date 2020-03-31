/*
 * 'FS' collection.
 *
 *  This collection holds the content of the specified directory.
 */
import { Mongo } from 'meteor/mongo';

export const FS = new Mongo.Collection( 'FS' ); // dynamic collection
