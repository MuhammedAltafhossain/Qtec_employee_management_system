import React, { useState } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import Loader from "../Loader/Loader";

const DepartmentAverageTable = ({
    loadData,
    loadingTable   
}) => {

return (
        <div>

            {loadingTable ? (
                <Loader/>
            ) : (
                <div>
                    <table className="table-fixed w-full text-left border border-double">
                        <TableHeader />
                        <tbody className="border bg-white text-gray-900 dark:bg-gray-600 dark:text-gray-300">
                            {loadData.length > 0 ? (
                                loadData.map((item, index) => (
                                    <TableRow
                                        key={item.id || index}
                                        data={item}
                                        index={index}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-2 border">
                                        No data found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            

          </div>
    );
};

export default DepartmentAverageTable;
