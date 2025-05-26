import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams, HttpEventType } from '@angular/common/http';
import { Task } from "../model/Task";
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaskService{
    http: HttpClient = inject(HttpClient);
    errorSubject = new Subject<HttpErrorResponse>();

    CreateTask(task: Task){
        const headers = new HttpHeaders({'my-header': 'hello-world'})
        this.http.post<{name: string}>(
            'https://angular-http-client-e310f-default-rtdb.firebaseio.com/tasks.json', 
            task, {headers: headers}
            )
            .subscribe({error: (err) => {
                this.errorSubject.next(err);
            }});
    }

    DeleteTask(id: string | undefined){
        this.http.delete('https://angular-http-client-e310f-default-rtdb.firebaseio.com/tasks/' +id+'.json')
        .subscribe({error: (err) => {
            this.errorSubject.next(err);
        }});
    }

    DeleteAllTasks(){
        this.http.delete('https://angular-http-client-e310f-default-rtdb.firebaseio.com/tasks.json', {observe: 'events', responseType: 'json'})
        .subscribe({error: (err) => {
            this.errorSubject.next(err);
        }})
    }

    GetAlltasks(){
        let headers = new HttpHeaders();
        headers = headers.append('content-type', 'application/json');
        headers = headers.append('content-type', 'text/html')

        let queryParams = new HttpParams();
        queryParams = queryParams.set('page', 2);
        queryParams = queryParams.set('item', 10)

        return this.http.get<{[key: string]: Task}>(
            'https://angular-http-client-e310f-default-rtdb.firebaseio.com/tasks.json'
            ,{headers: headers, params: queryParams, observe: 'body'}
            ).pipe(map((response) => {
                 let tasks = [];
                 console.log(response);
                 for(let key in response){
                   if(response.hasOwnProperty(key)){
                     tasks.push({...response[key], id: key});
                   }              
                 }
     
                 return tasks;
            }), )
    }

    UpdateTask(id: string | undefined, data: Task){
        this.http.put('https://angular-http-client-e310f-default-rtdb.firebaseio.com/tasks/'+id+'.json', data)   
        .subscribe({error: (err) => {
            this.errorSubject.next(err);
        }});
    }

    getTaskDetails(id: string | undefined): Observable<Task> {
  return this.http.get<Task>('https://angular-http-client-e310f-default-rtdb.firebaseio.com/tasks/' + id + '.json')
    .pipe(map((response) => {
      return { ...response, id } as Task;
    }));
}

}